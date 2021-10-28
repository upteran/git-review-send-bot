import {
  GroupApiType,
  IGroupServiceApi,
  IReviewServiceApi
} from '../../../api/types';
import { DbChatType } from '../types';
import {
  IUser,
  IUserRecord,
  IUsersReviewRecord
} from '../../../models/user/types';
import { IReviewRecord } from '../../../models/review/types';

// api mock fn
const getReviewQueue =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<Array<number>> => {
    const { chatId } = config;
    return db[chatId].review_queue;
  };
const getUsersReview =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<string> => {
    const { chatId, id = 1 } = config;
    return db[chatId].users_review[id];
  };
const addReviewQueue =
  (db: DbChatType) =>
  async (config: GroupApiType, value: any): Promise<void> => {
    const { chatId } = config;
    db[chatId].review_queue = value;
  };
const addUserToGroup =
  (db: DbChatType) =>
  async (config: GroupApiType, value: any): Promise<void> => {
    const { chatId, id = 1 } = config;
    db[chatId].members = { ...(db[chatId].members || {}), [id]: value };
  };
const updateUser =
  (db: DbChatType) =>
  async (config: GroupApiType, params: any): Promise<void> => {
    const { chatId, id } = config;
    Object.keys(params).forEach(key => {
      // @ts-ignore
      db[chatId].members[id][key] = params[key];
    });
  };
const getUser =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<IUser> => {
    const { chatId, id } = config;
    // @ts-ignore
    return db[chatId].members[id];
  };

const addReview =
  (db: DbChatType) =>
  async (config: GroupApiType, values: any): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].reviews[id] = values;
  };
const getUsersReviewList =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<IUsersReviewRecord> => {
    const { chatId } = config;
    return db[chatId].users_review;
  };
const getReview = (db: DbChatType) => async (config: GroupApiType) => {
  const { chatId, id } = config;
  // @ts-ignore
  return db[chatId].reviews[id];
};
const getReviewsList =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<IReviewRecord> => {
    const { chatId } = config;
    return db[chatId].reviews;
  };
const getUsersList =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<IUserRecord> => {
    const { chatId } = config;
    return db[chatId].members;
  };
const addUserReview =
  (db: DbChatType) =>
  async (config: GroupApiType, value: any): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].users_review[id] = value;
  };
const removeUserReview =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].users_review[id] = null;
  };
const removeReview =
  (db: DbChatType) =>
  async (config: GroupApiType): Promise<void> => {
    const { chatId, id } = config;
    // @ts-ignore
    db[chatId].reviews[id] = null;
  };

// mock service api
export const apiGroupMock = (db: DbChatType): IGroupServiceApi => ({
  getReviewQueue: getReviewQueue(db),
  getUsersReview: getUsersReview(db),
  addReviewQueue: addReviewQueue(db),
  addUserToGroup: addUserToGroup(db),
  updateUser: updateUser(db),
  getUser: getUser(db)
});

export const apiReviewMock = (db: DbChatType): IReviewServiceApi => ({
  getReviewQueue: getReviewQueue(db),
  addReview: addReview(db),
  getUsersReview: getUsersReview(db),
  addReviewQueue: addReviewQueue(db),
  getUsersReviewList: getUsersReviewList(db),
  getReview: getReview(db),
  getReviewsList: getReviewsList(db),
  getUser: getUser(db),
  getUsersList: getUsersList(db),
  addUserReview: addUserReview(db),
  removeUserReview: removeUserReview(db),
  removeReview: removeReview(db)
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
