import { ref, set, get, child, update } from 'firebase/database';
import { database } from '../config/firebase';
import User from '../models/User';
import Review from '../models/Review';

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

export function addUserToGroup(apiConfig: GroupApiType, user: User): void {
  const { id, chatId } = apiConfig;
  console.log('user', {
    ...user.params
  });
  set(ref(database, `groups/${chatId}/members/${id}`), {
    ...user.params
  }).catch(err => {
    throw new TypeError(`Error set user to db, err = ${err}`);
  });
}

export function updateReviewQueue(
  apiConfig: GroupApiType,
  reviewQueue: Array<number>
): void {
  const { chatId } = apiConfig;
  set(ref(database, `groups/${chatId}/review_queue/`), reviewQueue).catch(
    err => {
      throw new TypeError(`Error set user to db, err = ${err}`);
    }
  );
}

export function updateUser(
  apiConfig: GroupApiType,
  params: object
): Promise<void> {
  const { id, chatId } = apiConfig;
  if (!params) {
    throw new TypeError('Error user update, params to update not exists');
  }
  try {
    const updates = {};
    Object.keys(params).forEach(key => {
      // @ts-ignore
      updates[`groups/${chatId}/members/${id}/${key}`] = params[key];
    });
    return update(ref(database), updates);
  } catch (e) {
    throw TypeError(`Error on user update, error msg = ${e}`);
  }
}

export function getData({ path }: { path: string }): Function {
  return async function <T>(apiConfig: GroupApiType): Promise<T> {
    const { chatId, id = '' } = apiConfig;
    const dbRef = ref(database);
    const createdPath = `groups/${chatId}/${path}/${id}`;
    let data = null;
    try {
      const snapshot = await get(child(dbRef, createdPath));
      console.log('snapshot', snapshot);
      if (snapshot.exists()) {
        console.log(snapshot.val());
        data = snapshot.val();
      } else {
        console.log('No data available');
      }
    } catch (e) {
      console.error(e);
    }

    return data;
  };
}

export const getReviewQueue = getData({ path: 'review_queue' });
export const getUser = getData({ path: 'members' });
export const getUsersReview = getData({ path: 'reviews_users' });

// // reviews api
function addReview(
  apiConfig: GroupApiType,
  review: Review,
  userId: number
): void {
  const { id, chatId } = apiConfig;
  set(ref(database, `groups/${chatId}/reviews/${id}`), {
    ...review.params
  });

  set(ref(database, `groups/${chatId}/users_reviews/${userId}`), review.id);
}

export const groupApi = {
  addUserToGroup,
  updateUser,
  getReviewQueue,
  updateReviewQueue
};

export const reviewApi = {
  getReviewQueue,
  addReview,
  getUser,
  updateReviewQueue,
  getUsersReview
};
