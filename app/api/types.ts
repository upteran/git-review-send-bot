import Review, { IReviewRecord } from '../models/Review';
import User from '../models/user/User';
import { IUserRecord, IUsersReviewRecord } from '../models/user/types';

export type GroupApiType = {
  id?: number | string;
  chatId: number;
};

type UpdUserReviewParamsType = {
  nextUserId?: number;
  reviewId: string;
};

export interface GenericApiFn<T, R> {
  (apiConfig: GroupApiType, params?: T): Promise<R>;
}

export type GetReviewQueueType = GenericApiFn<undefined, Array<number>>;
export type AddReviewType = GenericApiFn<Review, Array<void>>;
export type UpdateUserReviewType = GenericApiFn<UpdUserReviewParamsType, void>;
export type UpdateReviewQueueType = GenericApiFn<Array<number>, void>;
export type GetUsersReviewType = GenericApiFn<undefined, IUsersReviewRecord>;
export type GetReviewType = GenericApiFn<undefined, Review>;
export type GetReviewsListType = GenericApiFn<undefined, IReviewRecord>;
export type GetUserType = GenericApiFn<undefined, User>;
export type GetUsersListType = GenericApiFn<undefined, IUserRecord>;
export type RemoveUserReviewType = GenericApiFn<undefined, void>;
export type RemoveReviewType = GenericApiFn<undefined, void>;

export interface IReviewServiceApi {
  getReviewQueue: GetReviewQueueType;
  addReview: AddReviewType;
  updateUserReview: UpdateUserReviewType;
  updateReviewQueue: UpdateReviewQueueType;
  getUsersReview: GetUsersReviewType;
  getReview: GetReviewType;
  getUser: GetUserType;
  removeUserReview: RemoveUserReviewType;
  removeReview: RemoveReviewType;
  getUsersList: GetUsersListType;
  getReviewsList: GetReviewsListType;
}
