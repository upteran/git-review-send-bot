import User from '../../models/user/User';
import Review from '../../models/review/Review';
import { IUser } from '../../models/user/types';
import { DbChatType } from './types';

const mockUser = { id: 1, username: 'some' };

export const mockSendTgMsg = (
  user = mockUser,
  chatId = 1,
  msgCb = (msg: any): void => console.log(msg),
  // TODO: move to const and add type
  message = {
    text: '/review msg',
    entities: [{ offset: 0, length: 7, type: 'bot_command' }]
  }
): object => ({
  from: user,
  chat: { id: chatId },
  reply: msgCb,
  message
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
  dbMock: DbChatType,
  chatId: number,
  userId: number
): void => {
  // @ts-ignore
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
  db[chatId]['review_queue'].push(id);
};

export const disableUser = (
  db: DbChatType,
  chatId: number,
  userId: number
): void => {
  // @ts-ignore
  db[chatId].members[userId].status = 'disable';
  db[chatId].review_queue = db[chatId].review_queue.filter(id => id !== userId);
};

export const enableUser = (
  db: DbChatType,
  chatId: number,
  userId: number
): void => {
  // @ts-ignore
  db[chatId].members[userId].status = 'active';
  db[chatId].review_queue.push(userId);
};
