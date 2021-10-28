import User from '../models/User';
import Review from '../models/Review';

export type Record<T extends number | string, U> = {
  [key in T]: U;
};

export let myUserRecord: Record<string, User>;
export let myUsersReviewRecord: Record<string, string | number>;
export let myReviewRecord: Record<string, Review>;
