import { myUserRecord, myReviewRecord } from '../../models/types';

export type DbType = {
  members: typeof myUserRecord;
  review_queue: Array<number>;
  users_review: { [key: string | number]: string };
  reviews: typeof myReviewRecord;
};

export type DbChatType = {
  [key: number]: DbType;
};
