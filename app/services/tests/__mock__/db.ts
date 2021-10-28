import User from '../../../models/User';
import Review from '../../../models/Review';
import { DbChatType } from '../../../services/tests/types';

export const getUserObj = (id: number, username: string): User =>
  new User(id, username);

export const getUserRecord = (id: number, username: string): object => ({
  [id]: getUserObj(id, username)
});

export const getReviewRecord = (
  id: string,
  msg: string,
  authorId: number
): object => ({
  [id]: new Review(id, msg, authorId)
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
