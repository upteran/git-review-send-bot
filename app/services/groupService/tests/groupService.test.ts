import { groupService } from '../../../services/groupService/index';
import User from '../../../models/user/User';
import { apiMock } from './mock';

const mockUser = { id: 1, username: 'some' };

const mockSendMsg = (user = mockUser, chatId = 1) => ({
  from: user,
  // @ts-ignore
  chat: { id: chatId },
  reply: (msg: string): void => console.log(msg)
});

describe('group Service', () => {
  it('should reg users to ', async () => {
    const dbMock = {
      1: {} // create chat with id === 1
    };
    const expectData = {
      1: {
        members: {}
      }
    };
    const expectedQueue = [];
    const gService = groupService(apiMock(dbMock));
    for (let i = 0; i < 20; i++) {
      const user = {
        id: i + 1,
        username: `name${i}`
      };
      expectData[1].members = {
        ...(expectData[1].members || {}),
        [user.id]: {
          ...new User(user.id, user.username).params
        }
      };
      expectedQueue.push(user.id);
      const tgCtx = mockSendMsg(user);
      await gService.registrationUser(tgCtx);
    }
    // @ts-ignore
    expectData[1]['review_queue'] = expectedQueue;
    expect(dbMock).toBe(expectData);
  });
});
