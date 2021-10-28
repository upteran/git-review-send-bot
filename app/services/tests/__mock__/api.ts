import {
  GroupApiType,
  IGroupServiceApi,
  IReviewServiceApi
} from '../../../api/types';
import { DbChatType } from '../types';
import { IUsersReviewRecord } from '../../../models/user/types';
import { IReviewRecord } from '../../../models/review/types';

export const apiMock = (db: DbChatType): IGroupServiceApi => ({
  getReviewQueue: async (config: GroupApiType) => {
    const { chatId } = config;
    return db[chatId].review_queue;
  },
  getUsersReview: async (config: GroupApiType): Promise<string> => {
    const { chatId, id = 1 } = config;
    return db[chatId].users_review[id];
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
  },
  getUser: async (config: GroupApiType) => {
    const { chatId, id } = config;
    // @ts-ignore
    return db[chatId].members[id];
  }
});

export const apiReviewMock = (db: DbChatType): IReviewServiceApi => ({
  getReviewQueue: async (config: GroupApiType): Promise<Array<number>> => {
    const { chatId } = config;
    return db[chatId].review_queue;
  },
  addReview: async (config: GroupApiType, values: any): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].reviews[id] = values;
  },
  getUsersReview: async (config: GroupApiType): Promise<string> => {
    const { chatId, id = 1 } = config;
    return db[chatId].users_review[id];
  },
  addReviewQueue: async (config: GroupApiType, value: any): Promise<void> => {
    const { chatId } = config;
    db[chatId].review_queue = value;
  },
  getUsersReviewList: async (
    config: GroupApiType
  ): Promise<IUsersReviewRecord> => {
    const { chatId } = config;
    return db[chatId].users_review;
  },
  getReview: async (config: GroupApiType) => {
    const { chatId, id } = config;
    // @ts-ignore
    return db[chatId].reviews[id];
  },
  getReviewsList: async (config: GroupApiType): Promise<IReviewRecord> => {
    const { chatId } = config;
    return db[chatId].reviews;
  },
  getUser: async (config: GroupApiType) => {
    const { chatId, id } = config;
    // @ts-ignore
    return db[chatId].members[id];
  },
  // @ts-ignore
  getUsersList: async (config: GroupApiType) => {
    const { chatId } = config;
    return db[chatId].members;
  },
  addUserReview: async (config: GroupApiType, value): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].users_review[id] = value;
  },
  removeUserReview: async (config: GroupApiType): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].users_review[id] = null;
  },
  removeReview: async (config: GroupApiType): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].reviews[id] = null;
  },
  updateUser: async (config: GroupApiType, params: any) => {
    const { chatId, id } = config;
    Object.keys(params).forEach(key => {
      // @ts-ignore
      db[chatId].members[id][key] = params[key];
    });
  }
});

export const apiErrorMock = (): IGroupServiceApi => ({
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
  },
  getUser: async () => {
    throw Error();
  }
});
