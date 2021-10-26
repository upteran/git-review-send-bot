import User from '../../models/user/User';
import Review from '../../models/review/Review';
import { IUser } from '../../models/user/types';
import { DbChatType } from './types';

const mockUser = { id: 1, username: 'some' };

export const mockSendTgMsg = (
  user = mockUser,
  chatId = 1,
  msgCb = (msg: any): void => console.log(msg)
): object => ({
  from: user,
  // @ts-ignore
  chat: { id: chatId },
  reply: msgCb
});

export const getUserObj = (id: number, username: string): IUser => ({
  ...new User(id, username).params
});

export const getUserRecord = (id: number, username: string): object => ({
  [id]: getUserObj(id, username)
});

export const getReviewRecord = (
  id: string,
  msg: string,
  authorId: number
): object => ({
  [id]: new Review(id, msg, authorId).params
});

export const addReviewToUser = (
  dbMock: any,
  chatId: number,
  userId: number
): void => {
  dbMock[chatId].users_review[userId] = `${userId}`;
  dbMock[chatId].reviews = {
    ...dbMock[chatId].reviews,
    ...getReviewRecord(`${userId}`, `msg${1}`, userId)
  };
};

export const createEmptyDb = (chatId: number): DbChatType => ({
  [chatId]: {
    members: {},
    review_queue: [],
    users_review: {},
    reviews: {}
  }
});

export const addUserToMockDb = (
  db: DbChatType,
  chatId: number,
  { id, username }: { id: number; username: string }
): void => {
  db[chatId].members = {
    ...(db[chatId].members || {}),
    ...getUserRecord(id, username)
  };
  if (!db[chatId]['review_queue']) {
    db[chatId]['review_queue'] = [];
  }
  db[chatId]['review_queue'].push(id);
};

export const disableUserCheck = (
  db: DbChatType,
  expectDb: { [key: number]: { review_queue: Array<number> } },
  chatId: number,
  userId: number
): void => {
  // @ts-ignore
  expectDb[chatId].members[userId].status = 'disable';
  expectDb[chatId].review_queue = expectDb[chatId].review_queue.filter(
    id => id !== userId
  );
  expect(db).toStrictEqual(expectDb);
};

export const enableUserCheck = (
  db: DbChatType,
  expectDb: DbChatType,
  chatId: number,
  userId: number
): void => {
  // @ts-ignore
  expectDb[chatId].members[userId].status = 'active';
  expectDb[chatId].review_queue.push(userId);
  expect(db).toStrictEqual(expectDb);
};
