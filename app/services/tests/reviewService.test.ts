import { reviewService } from '../reviewService';
import { apiReviewMock } from './__mock__/api';
import {
  createEmptyDb,
  getUserObj,
  addUserToMockDb,
  disableUser
} from './__mock__/db';
import { mockSendTgMsg } from './__mock__/tg';

const getTgCtx = (userId: number) => {
  return mockSendTgMsg(
    { id: userId, username: `name${userId}` },
    chatId,
    (msg: any) => console.log(msg)
  );
};
const chatId = 1;

describe('review Service', () => {
  it('remove id from queue by order', async () => {
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    const filledQueue = [...dbMock[chatId].review_queue];

    for (let i = 1; i < 10; i++) {
      const tgCtx = getTgCtx(i);

      // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
      await gService.setReview(tgCtx);
      filledQueue.shift();
      expect(dbMock[chatId].review_queue).toEqual(filledQueue);
    }
  });

  it('set review to user only after disabled users', async () => {
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    expect(dbMock[chatId].review_queue.length).toBe(9);

    disableUser(dbMock, chatId, 1);
    disableUser(dbMock, chatId, 2);
    disableUser(dbMock, chatId, 3);

    expect(dbMock[chatId].review_queue[0]).toBe(4);

    const tgCtx = getTgCtx(8);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.setReview(tgCtx);
    expect(dbMock[chatId].review_queue[0]).toBe(5);
  });

  it('should set review to db and create connect with user id', async () => {
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    expect(dbMock[chatId].review_queue.length).toBe(9);

    const authorId = 8;
    const tgCtx = getTgCtx(authorId);

    const userSelectedId = 1;
    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.setReview(tgCtx);
    expect(dbMock[chatId].review_queue[0]).toBe(userSelectedId + 1);

    const userReviewId = dbMock[chatId].users_review[userSelectedId];
    const review = dbMock[chatId].reviews[userReviewId];
    // check create and exist review in DB
    expect(review).toEqual({
      id: userReviewId,
      authorId,
      msg: ' msg',
      createDateTime: null,
      endDateTime: null
    });
    // check exist connect with user id
    expect(!!userReviewId).toEqual(true);
  });

  it('remove review / remove user-review connect / add user id to queue', async () => {
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    const authorId = 8;
    const tgCtx = getTgCtx(authorId);

    const userSelectedId = 1;
    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.setReview(tgCtx);

    const reviewId = dbMock[chatId].users_review[userSelectedId];
    const tgCtxEndReview = getTgCtx(userSelectedId);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.endReview(tgCtxEndReview);
    expect(dbMock[chatId].reviews[reviewId]).toEqual(null);
    expect(dbMock[chatId].users_review[userSelectedId]).toEqual(null);
    expect(
      dbMock[chatId].review_queue[dbMock[chatId].review_queue.length - 1]
    ).toEqual(userSelectedId);
  });

  it('remove review / remove user-review connect / add user id to queue', async () => {
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    const authorId = 8;
    const tgCtx = getTgCtx(authorId);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.setReview(tgCtx);

    const userSelectedId = 1;
    const reviewId = dbMock[chatId].users_review[userSelectedId];
    const tgCtxEndReview = getTgCtx(userSelectedId);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.endReview(tgCtxEndReview);
    expect(dbMock[chatId].reviews[reviewId]).toEqual(null);
    expect(dbMock[chatId].users_review[userSelectedId]).toEqual(null);
    expect(
      dbMock[chatId].review_queue[dbMock[chatId].review_queue.length - 1]
    ).toEqual(userSelectedId);
  });

  it('check status', async () => {
    console.log = jest.fn();
    const dbMock = createEmptyDb(chatId);
    const gService = reviewService(apiReviewMock(dbMock));

    for (let i = 1; i < 10; i++) {
      const user = getUserObj(i, `name${i}`);
      addUserToMockDb(dbMock, chatId, user);
    }

    const authorId = 1;
    const tgCtx = getTgCtx(authorId);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.checkStatus(tgCtx);

    const userSelectedId = 8;
    const tgCtxSetReview = getTgCtx(userSelectedId);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.setReview(tgCtxSetReview);

    // @ts-ignore because of tgCtx is mock and not extend to TelegrafCtx
    await gService.checkStatus(tgCtx);

    // 1 => no MR msg
    // 2 => set MR msg
    // 3 => check MR msg
    // @ts-ignore
    expect(console.log.mock.calls.length).toBe(3);
    // @ts-ignore
    expect(console.log.mock.calls[0][0]).toEqual(
      `[name1](tg://user?id=${authorId}), haven't any MR to review`
    );

    // @ts-ignore
    expect(console.log.mock.calls[2][0]).toEqual(
      `[name1](tg://user?id=${authorId}), [you have active MR to review =  msg]`
    );
  });
});
