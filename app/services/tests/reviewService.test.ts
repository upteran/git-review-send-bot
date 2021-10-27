import { reviewService } from '../reviewService';
import { apiReviewMock } from './mock';
import {
  createEmptyDb,
  getUserObj,
  addUserToMockDb,
  disableUser,
  mockSendTgMsg
} from './helpers';

const chatId = 1;

describe('review Service', () => {
  it('remove id from queue by order', async () => {
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    const filledQueue = [...dbMock[chatId].review_queue];

    for (let i = 1; i < 10; i++) {
      const tgCtx = mockSendTgMsg(
        { id: i, username: `name${i}` },
        chatId,
        (msg: any) => console.log(msg)
      );

      // @ts-ignore
      await gService.setReview(tgCtx);
      filledQueue.shift();
      expect(dbMock[chatId].review_queue).toEqual(filledQueue);
    }
  });

  it('set review to user only after disabled users', async () => {
    const dbMock = createEmptyDb(chatId);
    const expectDb = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
      addUserToMockDb(expectDb, chatId, user);
    }

    expect(dbMock[chatId].review_queue.length).toBe(9);

    disableUser(dbMock, chatId, 1);
    disableUser(dbMock, chatId, 2);
    disableUser(dbMock, chatId, 3);

    expect(dbMock[chatId].review_queue[0]).toBe(4);

    const tgCtx = mockSendTgMsg(
      { id: 8, username: `name${8}` },
      chatId,
      (msg: any) => msg
    );

    // @ts-ignore
    await gService.setReview(tgCtx);
    expect(dbMock[chatId].review_queue[0]).toBe(5);
  });
});
