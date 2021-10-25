export const apiMock = (db: any) => ({
  getReviewQueue: async (config: any) => {
    const { chatId } = config;
    return db[chatId].review_queue;
  },
  getUsersReview: async (config: any) => {
    const { chatId, id } = config;
    return db[chatId].reviews[id];
  },
  addReviewQueue: async (config: any, value: any) => {
    const { chatId } = config;
    db[chatId].review_queue = value;
  },
  addUserToGroup: async (config: any, value: any) => {
    const { chatId, id } = config;
    db[chatId].members = { ...(db[chatId].members || {}), [id]: value };
  },
  updateUser: async (config: any, params: any) => {
    const { chatId, id } = config;
    Object.keys(params).forEach(key => {
      // @ts-ignore
      db[chatId].members[id][key] = params[key];
    });
  }
});
