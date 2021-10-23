/* eslint-ignore */
import { TelegrafContext } from 'telegraf/typings/context';
import { nanoid } from 'nanoid';

import Review from '../../models/Review';
import User from '../../models/User';
import { getUserMessage } from '../../helpers/getUserMessage';
import { parseName } from '../../helpers/tgParsers/user';
import { GroupApiType } from '../../api';

interface IReviewService {
  setReview: Function;
  // endReview: Function;
  // checkStatus: Function;
  // checkAllStatus: Function;
  // clearAllReviews: Function;
}

export const reviewService = (api: {
  getReviewQueue: (apiConfig: GroupApiType) => Array<number>;
  addReview: (
    apiConfig: GroupApiType,
    review: Review,
    userId: number,
    order: Array<number>
  ) => void;
  getUser: (apiConfig: GroupApiType) => User;
}): IReviewService => {
  // init api
  const serviceApi = api;
  // check tg errors
  const errorHandlerDecorator =
    (fn: Function) => async (ctx: TelegrafContext) => {
      if (!ctx.from) throw new Error('No `from` field found on context');
      if (!ctx.chat) throw new Error('No `chat` field found on context');
      try {
        fn(ctx);
      } catch (e) {
        console.error(e);
      }
    };
  const setReview = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id: authorId },
      // @ts-ignore
      chat: { id: chatId },
      message,
      reply
    } = ctx;
    const reviewId = nanoid();
    const msg = getUserMessage(message);

    if (!msg || !msg.length) {
      reply('Need merge request link!');
      return;
    }

    console.log('user msg', msg);

    // ts-ignore
    const order = await serviceApi.getReviewQueue({ chatId });
    console.log('review_order', order);
    if (!order.length) {
      return reply('Everybody busy');
      return;
    }

    const review = new Review(reviewId, msg, authorId);

    const nextUserId = order.shift();

    console.log(review);
    console.log(nextUserId);

    const apiConfig = {
      id: reviewId,
      chatId
    };

    // @ts-ignore
    await serviceApi.addReview(apiConfig, review, nextUserId, order);

    const user = await serviceApi.getUser({ chatId, id: nextUserId });

    reply(
      `${parseName(user.username, user.id)}, you got merge request: ${
        review.msg
      }`,
      {
        parse_mode: 'HTML'
      }
    );
  };

  // const endReview = async (ctx: TelegrafContext) => {
  //   const {
  //     from: { id },
  //     chat: { id: chatId },
  //     reply
  //   } = ctx;
  //   await serviceApi.endReview({ id, chatId });
  //   await serviceApi.updateReviewOrder({ chatId, id });
  //   const user = serviceApi.getUser({ chatId, id });
  //
  //   reply(`dobby if free ${parseName(user.nickname, user.id)}`, {
  //     parse_mode: 'HTML'
  //   });
  // };
  //
  // const checkStatus = async (ctx: TelegrafContext) => {
  //   const {
  //     from: { id },
  //     chat: { id: chatId },
  //     reply
  //   } = ctx;
  //   const userReview = await serviceApi.getUserReview({ chatId, id });
  //   const user = await serviceApi.getUser({ id, chatId });
  //
  //   let msg = `${parseName(user.nickname, id)}, haven't any MR to review`;
  //   if (userReview) {
  //     msg = `${parseName(user.nickname, id)}, [you have active MR to review]()`;
  //   }
  //
  //   reply(msg, {
  //     parse_mode: 'Markdown'
  //   });
  // };
  //
  // const checkAllStatus = async (ctx: TelegrafContext) => {
  //   const {
  //     from: { id },
  //     chat: { id: chatId }
  //   } = ctx;
  //   const reviews = await serviceApi.getReviews({});
  //   const users = await serviceApi.getReviews({});
  // };
  //
  // const clearAllReviews = async (ctx: TelegrafContext) => {
  //   const {
  //     from: { id },
  //     chat: { id: chatId }
  //   } = ctx;
  // };

  return {
    setReview: errorHandlerDecorator(setReview)
    // endReview: errorHandlerDecorator(endReview),
    // checkStatus: errorHandlerDecorator(checkStatus),
    // checkAllStatus: errorHandlerDecorator(checkAllStatus),
    // clearAllReviews: errorHandlerDecorator(clearAllReviews)
  };
};
