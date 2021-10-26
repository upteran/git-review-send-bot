import { GroupApiType, IGroupServiceApi } from '../../api/types';
import { DbChatType } from './types';

export const apiMock = (db: DbChatType): IGroupServiceApi => ({
  getReviewQueue: async (config: GroupApiType) => {
    const { chatId } = config;
    return db[chatId].review_queue;
  },
  getUsersReview: async (config: GroupApiType) => {
    const { chatId, id = 1 } = config;
    // @ts-ignore
    return db[chatId]?.reviews[id];
  },
  addReviewQueue: async (config: GroupApiType, value: any) => {
    const { chatId } = config;
    db[chatId].review_queue = value;
  },
  addUserToGroup: async (config: GroupApiType, value: any) => {
    const { chatId, id = 1 } = config;
    db[chatId].members = { ...(db[chatId].members || {}), [id]: value };
  },
  updateUser: async (config: GroupApiType, params: any) => {
    const { chatId, id } = config;
    Object.keys(params).forEach(key => {
      // @ts-ignore
      db[chatId].members[id][key] = params[key];
    });
  }
});

export const apiErrorMock = (): any => ({
  getReviewQueue: async () => {
    throw Error();
  },
  getUsersReview: async () => {
    throw Error();
  },
  addReviewQueue: async () => {
    throw Error();
  },
  addUserToGroup: async () => {
    throw Error();
  },
  updateUser: async () => {
    throw Error();
  }
});
