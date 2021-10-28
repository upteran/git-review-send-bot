import { groupService } from '../groupService';
import { apiGroupMock, apiErrorMock } from './__mock__/api';
import {
  createEmptyDb,
  getUserObj,
  addReviewToUser,
  addUserToMockDb
} from './__mock__/db';
import { mockSendTgMsg } from './__mock__/tg';

const chatId = 1;

describe('group Service', () => {
  it('should add users to db and send msg', async () => {
    console.log = jest.fn();
    const dbMock = createEmptyDb(chatId);
    const expectData = createEmptyDb(chatId);
    const gService = groupService(apiGroupMock(dbMock));

    for (let i = 1; i < 20; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(expectData, chatId, user);
      const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));
      await gService.registrationUser(tgCtx);
    }
    expect(dbMock).toStrictEqual(expectData);
    expect(console.log).toHaveBeenCalledWith('Welcome to team!');
  });

  it('should stop reg and send msg to user if user already exist', async () => {
    console.log = jest.fn();
    const userId = 1;
    const userName = `name${1}`;
    const dbMock = createEmptyDb(chatId);
    const gService = groupService(apiGroupMock(dbMock));

    const user = getUserObj(userId, `name${1}`);

    const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));
    await gService.registrationUser(tgCtx);

    expect(dbMock[chatId].members[userId].username).toEqual(userName);
    await gService.registrationUser(tgCtx);

    expect(console.log).toHaveBeenLastCalledWith('User already exist!');
  });

  it('shouldn`t add users duplicate with same id to db and queue', async () => {
    console.log = jest.fn();
    const dbMock = createEmptyDb(chatId);
    const expectData = createEmptyDb(chatId);
    const gService = groupService(apiGroupMock(dbMock));

    for (let i = 1; i < 20; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(expectData, chatId, user);
      const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));
      await gService.registrationUser(tgCtx);
    }

    const user = getUserObj(3, `name${3}`);
    const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));
    await gService.registrationUser(tgCtx);
    await gService.registrationUser(tgCtx);
    expect(dbMock).toStrictEqual(expectData);
  });

  it('should handler error if reg is not valid', async () => {
    console.error = jest.fn();
    const expectData = createEmptyDb(chatId);
    const gService = groupService(apiErrorMock());
    const user = getUserObj(1, 'name1');
    addUserToMockDb(expectData, chatId, user);

    const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));
    await gService.registrationUser(tgCtx);
    expect(console.error).toHaveBeenCalledWith(
      'error handler log registrationUser',
      new Error()
    );
  });

  it('should remove user id from queue if opt out', async () => {
    const dbMock = createEmptyDb(chatId);
    const expectData = createEmptyDb(chatId);

    // create 5 users
    for (let i = 1; i <= 5; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(expectData, chatId, user);
      addUserToMockDb(dbMock, chatId, user);
    }
    const gService = groupService(apiGroupMock(dbMock));

    const activeUserId = 3;
    const user = getUserObj(activeUserId, `name${activeUserId}`);
    const tgCtx = mockSendTgMsg(user, chatId, () => 'str');
    await gService.disableUser(tgCtx);

    const dbQ = dbMock[chatId].review_queue;

    expect(dbQ[activeUserId - 1]).toBe(activeUserId + 1);
  });

  it('should send msg and stop opt out if user has active review', async () => {
    console.log = jest.fn();
    const dbMock = createEmptyDb(chatId);
    const expectData = createEmptyDb(chatId);
    const activeUserId = 1;

    // create 5 users
    for (let i = 1; i < 5; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(expectData, chatId, user);
      addUserToMockDb(dbMock, chatId, user);
    }

    addReviewToUser(dbMock, chatId, activeUserId);
    const gService = groupService(apiGroupMock(dbMock));

    const user = getUserObj(activeUserId, `name${activeUserId}`);
    const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));
    await gService.disableUser(tgCtx);
    expect(console.log).toHaveBeenCalledWith(
      'You have got active MR, close it before out'
    );
  });
  it('should add user id to queue if opt in', async () => {
    console.log = jest.fn();
    const dbMock = createEmptyDb(chatId);
    const expectData = createEmptyDb(chatId);
    const activeUserId = 3;

    // create 5 users
    for (let i = 1; i < 5; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(expectData, chatId, user);
      addUserToMockDb(dbMock, chatId, user);
    }

    const gService = groupService(apiGroupMock(dbMock));

    const user = getUserObj(activeUserId, `name${activeUserId}`);
    const tgCtx = mockSendTgMsg(user, chatId, (msg: any) => console.log(msg));

    let dbQ = null;

    await gService.disableUser(tgCtx);
    dbQ = dbMock[chatId].review_queue;
    expect(dbQ[activeUserId - 1]).toBe(activeUserId + 1);

    // enable user
    await gService.enableUser(tgCtx);
    dbQ = dbMock[chatId].review_queue;
    expect(dbQ[dbQ.length - 1]).toBe(activeUserId);
  });
});
