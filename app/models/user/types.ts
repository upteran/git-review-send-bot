import User from './User';

export interface IUser {
  id: number;
  username: string;
  status: string;
  reviews: Array<number> | null;
}

export interface IUsersReviewRecord {
  [key: string]: string | number;
}

export interface IUserRecord {
  [key: string]: User;
}
