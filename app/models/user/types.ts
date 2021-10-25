import User from './User';

export interface IUsersReviewRecord {
  [key: string]: string | number;
}

export interface IUserRecord {
  [key: string]: User;
}
