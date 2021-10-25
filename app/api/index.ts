import { getData, addData, updateData, removeData } from './dbApi';
import {
  GetReviewQueueType,
  AddReviewType,
  UpdateUserReviewType,
  GetUsersReviewType,
  GetReviewType,
  GetUserType,
  RemoveUserReviewType,
  RemoveReviewType
} from './types';

// import { doc, setDoc, getFirestore } from "firebase/firestore";
//
// const db = getFirestore();
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
 * users_review: {
 *   userID: reviewId
 * }
 *
 * */

// add api
export const addReviewQueue = addData({ path: 'review_queue' });
export const addUserToGroup = addData({ path: 'members' });
export const addReview: AddReviewType = addData({
  path: 'reviews'
});
export const addUserReview = addData({ path: 'users_reviews' });

// update api
export const updateUser = updateData({ path: 'members' });
export const updateReview = updateData({ path: 'reviews' });
export const updateUserReview: UpdateUserReviewType = updateData({
  path: 'users_reviews'
});

// get api
export const getReviewQueue: GetReviewQueueType = getData({
  path: 'review_queue'
});

export const getUser: GetUserType = getData({ path: 'members' });
export const getUsersList: GetUserType = getData({ path: 'members' });
export const getUsersReview: GetUsersReviewType = getData({
  path: 'reviews_users'
});
export const getReview: GetReviewType = getData({ path: 'reviews' });
export const getReviewsList: GetReviewType = getData({ path: 'reviews' });

// remove api
export const removeUserReview: RemoveUserReviewType = removeData({
  path: 'reviews_users'
});
export const removeReview: RemoveReviewType = removeData({ path: 'reviews' });

export const groupApi = {
  addUserToGroup,
  updateUser,
  getReviewQueue,
  addReviewQueue
};

export const reviewApi = {
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
  getReviewsList
};
