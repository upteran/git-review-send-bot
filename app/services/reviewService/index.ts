/* eslint-disable */
import { TelegrafContext } from 'telegraf/typings/context';
import { nanoid } from 'nanoid';

import Review from '../../models/Review';
import User from '../../models/User';
import { getUserMessage } from '../../helpers/getUserMessage';
import { parseName } from '../../helpers/tgParsers/user';
import { GroupApiType } from '../../api';

interface IReviewService {
  setReview: Function;
  endReview: Function;
  checkStatus: Function;
  checkAllStatus: Function;
  clearAllReviews: Function;
}

type HandlerFunction = (error: any, ctx: any) => void;

function handleError(
  ctx: any,
  errorClass: any,
  handler: HandlerFunction,
  error: any
) {
  // check if error is instance of passed error class
  if (typeof handler === 'function' && error instanceof errorClass) {
    // run handler with error object
    // and class context as second argument
    handler.call(null, error, ctx);
  } else {
    // throw error further,
    // next decorator in chain can catch it
    throw error;
  }
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
  updateReviewQueue: (
    apiConfig: GroupApiType,
    reviewQueue: Array<number>
  ) => void;
  getUsersReview: (apiConfig: GroupApiType) => Object;
}): IReviewService => {
  // init api
  const serviceApi = api;
  // check tg errors
  const errorHandlerDecorator =
    (errorClass: any, handler: HandlerFunction) =>
    // eslint-disable-next-line @typescript-eslint/ban-types
    (fn: Function) =>
    async (ctx: TelegrafContext) => {
      try {
        if (!ctx.from) throw new Error('No `from` field found on context');
        if (!ctx.chat) throw new Error('No `chat` field found on context');
        console.log('RUN');
        const result = fn(ctx);
        if (
          result &&
          typeof result.then === 'function' &&
          typeof result.catch === 'function'
        ) {
          // return promise
          return result.catch((error: any) => {
            handleError(this, errorClass, handler, error);
          });
        }
      } catch (e) {
        console.error('handle error', e);
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
    const reviewQueue = await serviceApi.getReviewQueue({ chatId });
    console.log('review_order', reviewQueue);
    if (!reviewQueue.length) {
      return reply('Everybody busy');
      return;
    }

    const review = new Review(reviewId, msg, authorId);

    const nextUserId = reviewQueue.shift();

    console.log(review);
    console.log(nextUserId);

    // @ts-ignore
    await serviceApi.addReview({ id: reviewId, chatId }, review, nextUserId);
    // TODO: add await
    serviceApi.updateReviewQueue({ chatId }, reviewQueue);

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

  const endReview = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id },
      // @ts-ignore
      chat: { id: chatId },
      reply
    } = ctx;

    const reviewsMap = await serviceApi.getUsersReview({ id, chatId });
    // TODO: dev api
    // await serviceApi.updateUsersReview({ id, chatId }, undefined);
    const reviewQueue = await serviceApi.getReviewQueue({ chatId });
    reviewQueue.push(id);
    await serviceApi.updateReviewQueue({ chatId }, reviewQueue);
    const user = await serviceApi.getUser({ chatId, id });
    // TODO: dev api
    // await serviceApi.updateReview({ id, chatId }, undefined);


    reply(`dobby if free ${parseName(user.username, user.id)}`, {
      parse_mode: 'HTML'
    });
  };

  const checkStatus = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id },
      // @ts-ignore
      chat: { id: chatId },
      reply
    } = ctx;
    const reviewsMap = await serviceApi.getUsersReview({ chatId });
    // @ts-ignore
    const reviewId = reviewsMap[id];
    // TODO: dev api
    // const reviews = await serviceApi.getReviews({ chatId });
    const reviews: any[] = [];
    const review = reviews.find(item => item.id === reviewId);
    const user = await serviceApi.getUser({ chatId, id });

    let msg = `${parseName(user.username, id)}, haven't any MR to review`;
    if (review) {
      msg = `${parseName(user.username, id)}, [you have active MR to review]()`;
    }

    reply(msg, {
      parse_mode: 'Markdown'
    });
  };

  const checkAllStatus = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id },
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    const reviewsMap = await serviceApi.getUsersReview({ chatId });
    // TODO: dev api
    // const users = await serviceApi.getUsers({ chatId });
    const users = {};
    // TODO: dev api
    // const reviews = await serviceApi.getReviews({ chatId });
    const reviews = {};
    Object.keys(reviewsMap).forEach(userId => {
      // @ts-ignore
      const currUser = users[userId];
      // @ts-ignore
      const currReview = reviews[reviewsMap[userId]];
      if (currUser) {
        ctx.reply(`${parseName(currUser.username, id)}: MR - ${currReview}`, {
          parse_mode: 'HTML'
        });
      } else {
        ctx.reply(
          `${parseName(currUser.username, id)}: need review something`,
          {
            parse_mode: 'HTML'
          }
        );
      }
    });
  };

  const clearAllReviews = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id },
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    // clear user_review table
    // clear reviews
    // show msgs
  };

  return {
    setReview: errorHandlerDecorator(Error, e =>
      console.log('error setReview', e)
    )(setReview),
    endReview: errorHandlerDecorator(Error, e =>
      console.log('error endReview', e)
    )(endReview),
    checkStatus: errorHandlerDecorator(Error, e =>
      console.log('error checkStatus', e)
    )(checkStatus),
    checkAllStatus: errorHandlerDecorator(Error, e =>
      console.log('error checkAllStatus', e)
    )(checkAllStatus),
    clearAllReviews: errorHandlerDecorator(Error, e =>
      console.log('error clearAllReviews', e)
    )(clearAllReviews)
  };
};
