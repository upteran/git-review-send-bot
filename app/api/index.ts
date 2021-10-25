import { getData, addData, updateData, removeData } from './dbApi';
import {
  GetReviewQueueType,
  AddReviewType,
  UpdateUserReviewType,
  GetUsersReviewType,
  GetReviewType,
  GetUserType,
  GetUsersListType,
  GetReviewsListType,
  RemoveUserReviewType,
  RemoveReviewType,
  GetUsersReviewListType,
  IGroupServiceApi,
  IReviewServiceApi
} from './types';

/**
 * members: {
 *   ids: [],
 *   list: {
 *
 *   }
 * }
 * review_queue: [],
 * reviews: {
 *   ids: [],
 *   list: {}
 * };
 * reviews_users: {
 *   userID: reviewId
 * }
 *
 * */
const endpoints = {
  REVIEW_QUEUE: 'review_queue',
  MEMBERS: 'members',
  REVIEWS: 'reviews',
  USERS_REVIEW: 'reviews_users'
};

// review_queue
export const addReviewQueue = addData({ path: endpoints.REVIEW_QUEUE });
export const getReviewQueue: GetReviewQueueType = getData({
  path: endpoints.REVIEW_QUEUE
});
export const updateReviewQueue: GetReviewQueueType = getData({
  path: endpoints.REVIEW_QUEUE
});

// members
export const addUserToGroup = addData({ path: endpoints.MEMBERS });
export const updateUser = updateData({ path: endpoints.MEMBERS });
export const getUser: GetUserType = getData({ path: endpoints.MEMBERS });
export const getUsersList: GetUsersListType = getData({
  path: endpoints.MEMBERS
});

// reviews
export const addReview: AddReviewType = addData({
  path: endpoints.REVIEWS
});
export const updateReview = updateData({ path: endpoints.REVIEWS });
export const getReview: GetReviewType = getData({ path: endpoints.REVIEWS });
export const getReviewsList: GetReviewsListType = getData({
  path: endpoints.REVIEWS
});
export const removeReview: RemoveReviewType = removeData({
  path: endpoints.REVIEWS
});

// users_reviews
export const addUserReview = addData({ path: endpoints.USERS_REVIEW });
export const updateUserReview: UpdateUserReviewType = updateData({
  path: endpoints.USERS_REVIEW
});
export const getUsersReview: GetUsersReviewType = getData({
  path: endpoints.USERS_REVIEW
});
export const getUsersReviewList: GetUsersReviewListType = getData({
  path: endpoints.USERS_REVIEW
});
export const removeUserReview: RemoveUserReviewType = removeData({
  path: endpoints.USERS_REVIEW
});

export const groupApi: IGroupServiceApi = {
  addUserToGroup,
  updateUser,
  getReviewQueue,
  addReviewQueue,
  getUsersReview
};

export const reviewApi: IReviewServiceApi = {
  getReviewQueue,
  addReview,
  getUser,
  addReviewQueue,
  getUsersReview,
  addUserReview,
  updateUserReview,
  removeUserReview,
  removeReview,
  getReview,
  getUsersList,
  getReviewsList,
  getUsersReviewList
};
