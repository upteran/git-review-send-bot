export type DbType = {
  members: object;
  review_queue: Array<number>;
  users_review: object;
  reviews: object;
};

export type DbChatType = {
  [key: number]: DbType;
};
