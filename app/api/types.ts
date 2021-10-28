import Review from '../models/review/Review';
import { IReviewRecord } from '../models/review/types';
import { IUser, IUsersReviewRecord, IUserRecord } from '../models/user/types';

export type GroupApiType = {
  id?: number | string;
  chatId: number;
};

// type UpdUserReviewParamsType = {
//   [key: string]: number;
// };

export interface GenericApiFn<T, R> {
  (apiConfig: GroupApiType, params?: T): Promise<R>;
}

export type GetReviewQueueType = GenericApiFn<undefined, Array<number>>;
export type AddReviewType = GenericApiFn<Review, void>;
export type AddReviewQueueType = GenericApiFn<object, void>;
export type GetUsersReviewType = GenericApiFn<undefined, string>;
export type GetUsersReviewListType = GenericApiFn<
  undefined,
  IUsersReviewRecord
>;
export type GetReviewType = GenericApiFn<undefined, Review>;
export type GetReviewsListType = GenericApiFn<undefined, IReviewRecord>;
export type GetUserType = GenericApiFn<undefined, IUser>;
export type GetUsersListType = GenericApiFn<undefined, IUserRecord>;
export type RemoveUserReviewType = GenericApiFn<undefined, void>;
export type RemoveReviewType = GenericApiFn<undefined, void>;
export type AddUserToGroupType = GenericApiFn<IUser, void>;
export type UpdateUserType = GenericApiFn<object, void>;
export type AddUserReviewType = GenericApiFn<string, void>;

export interface IReviewServiceApi {
  getReviewQueue: GetReviewQueueType;
  addReview: AddReviewType;
  getUsersReview: GetUsersReviewType;
  getUsersReviewList: GetUsersReviewListType;
  getReview: GetReviewType;
  getUser: GetUserType;
  removeUserReview: RemoveUserReviewType;
  removeReview: RemoveReviewType;
  getUsersList: GetUsersListType;
  getReviewsList: GetReviewsListType;
  addReviewQueue: AddReviewQueueType;
  addUserReview: AddUserReviewType;
}

// group

export interface IGroupServiceApi {
  getReviewQueue: GetReviewQueueType;
  getUsersReview: GetUsersReviewType;
  addReviewQueue: AddReviewQueueType;
  addUserToGroup: AddUserToGroupType;
  updateUser: UpdateUserType;
  getUser: GetUserType;
}
