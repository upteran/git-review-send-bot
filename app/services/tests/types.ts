import { IReviewRecord } from '../../models/review/types';
import { IUserRecord } from '../../models/user/types';

export type DbType = {
  members: IUserRecord;
  review_queue: Array<number>;
  users_review: { [key: string | number]: string };
  reviews: IReviewRecord;
};

export type DbChatType = {
  [key: number]: DbType;
};
