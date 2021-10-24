import { getData, addData, updateData } from './dbApi';

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

export type GroupApiType = {
  id?: number | string;
  chatId: number;
};

// export function addUserToGroup(apiConfig: GroupApiType, user: User): void {
//   const { id, chatId } = apiConfig;
//   console.log('user', {
//     ...user.params
//   });
//   set(ref(database, `groups/${chatId}/members/${id}`), {
//     ...user.params
//   }).catch(err => {
//     throw new TypeError(`Error set user to db, err = ${err}`);
//   });
// }

// add api
export const addReviewQueue = addData({ path: 'review_queue' });
export const addUserToGroup = addData({ path: 'members' });
export const addReview = addData({ path: 'reviews' });
export const addUserReview = addData({ path: 'users_reviews' });

// export function updateReviewQueue(
//   apiConfig: GroupApiType,
//   reviewQueue: Array<number>
// ): void {
//   const { chatId } = apiConfig;
//   set(ref(database, `groups/${chatId}/review_queue/`), reviewQueue).catch(
//     err => {
//       throw new TypeError(`Error set user to db, err = ${err}`);
//     }
//   );
// }

// update api
export const updateUser = updateData({ path: 'members' });
export const updateReview = updateData({ path: 'reviews' });
export const updateUserReview = updateData({ path: 'users_reviews' });
// export function updateUser(
//   apiConfig: GroupApiType,
//   params: object
// ): Promise<void> {
//   const { id, chatId } = apiConfig;
//   if (!params) {
//     throw new TypeError('Error user update, params to update not exists');
//   }
//   try {
//     const updates = {};
//     Object.keys(params).forEach(key => {
//       // @ts-ignore
//       updates[`groups/${chatId}/members/${id}/${key}`] = params[key];
//     });
//     return update(ref(database), updates);
//   } catch (e) {
//     throw TypeError(`Error on user update, error msg = ${e}`);
//   }
// }

// get api
export const getReviewQueue = getData({ path: 'review_queue' });
export const getUser = getData({ path: 'members' });
export const getUsersReview = getData({ path: 'reviews_users' });
export const getReview = getData({ path: 'reviews' });

// // reviews api
// function addReview(
//   apiConfig: GroupApiType,
//   review: Review,
//   userId: number
// ): void {
//   const { id, chatId } = apiConfig;
//   set(ref(database, `groups/${chatId}/reviews/${id}`), {
//     ...review.params
//   });
//
//   set(ref(database, `groups/${chatId}/users_reviews/${userId}`), review.id);
// }

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
  addUserReview
};
