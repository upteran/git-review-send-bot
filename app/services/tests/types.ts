import { IReviewRecord } from '../../models/review/types';

export type DbType = {
  members: object;
  review_queue: Array<number>;
  users_review: { [key: string | number]: string };
  reviews: IReviewRecord;
};

export type DbChatType = {
  [key: number]: DbType;
};
