/* eslint-disable */
import { TelegrafContext } from 'telegraf/typings/context';
import { nanoid } from 'nanoid';

import Review from '../../models/review/Review';
import { getUserMessage } from '../../helpers/getUserMessage';
import { parseName, parseHtmlName } from '../../helpers/tgParsers/user';
import { IReviewServiceApi } from '../../api/types';
import { chatErrorHandlerDecorator } from '../../helpers/errorHandler';

const errorCb = (name: string) => (e: any) => {
  console.error(`error handler log ${name}`, e);
};

export const reviewService = (api: IReviewServiceApi) => {
  // init api
  const serviceApi = api;

  const setReview = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id: authorId },
      // @ts-ignore
      chat: { id: chatId },
      message,
      reply
    } = ctx;

    const msg = getUserMessage(message);

    if (!msg || !msg.length) {
      reply('Need merge request link!');
      return;
    }

    const reviewQueue = await serviceApi.getReviewQueue({ chatId });

    if (!reviewQueue || !reviewQueue.length) {
      return reply('Everybody busy');
      return;
    }

    const reviewId = nanoid();
    const review = new Review(reviewId, msg, authorId);
    const nextUserId = reviewQueue.shift();

    await serviceApi.addReview({ id: reviewId, chatId }, review);
    await serviceApi.addUserReview({ id: authorId, chatId }, reviewId);
    await serviceApi.addReviewQueue({ chatId }, reviewQueue);

    const user = await serviceApi.getUser({ chatId, id: nextUserId });

    reply(
      `${parseHtmlName(user.username, user.id)}, you got merge request: ${
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

    const userReviewId = await serviceApi.getUsersReview({ id, chatId });
    await serviceApi.removeUserReview({ id, chatId });
    await serviceApi.removeReview({ id: userReviewId, chatId });

    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];
    if (!reviewQueue.includes(id)) {
      reviewQueue.push(id);
    }
    await serviceApi.addReviewQueue({ chatId }, reviewQueue);

    const user = await serviceApi.getUser({ chatId, id });

    reply(`dobby if free ${parseHtmlName(user.username, user.id)}`, {
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
    const reviewId = await serviceApi.getUsersReview({ id, chatId });
    const review = await serviceApi.getReview({ id: reviewId, chatId });
    const user = await serviceApi.getUser({ chatId, id });

    let msg = `${parseName(user.username, id)}, haven't any MR to review`;
    if (review) {
      msg = `${parseName(user.username, id)}, [you have active MR to review = ${
        review.msg
      }]`;
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
      chat: { id: chatId },
      reply
    } = ctx;
    const reviewsMap = await serviceApi.getUsersReviewList({ chatId });

    if (!reviewsMap) {
      reply('All users are available');
      return;
    }
    const users = await serviceApi.getUsersList({ chatId });
    const reviews = await serviceApi.getReviewsList({ chatId });
    Object.keys(reviewsMap).forEach(userId => {
      const currUser = users[userId];
      const currReview = reviews[reviewsMap[userId]];
      if (currReview) {
        reply(
          `${parseHtmlName(currUser.username, id)}: MR - ${currReview.msg}`,
          {
            parse_mode: 'HTML'
          }
        );
      } else {
        reply(
          `${parseHtmlName(currUser.username, id)}: need review something`,
          {
            parse_mode: 'HTML'
          }
        );
      }
    });
  };

  // const clearAllReviews = async (ctx: TelegrafContext) => {
  //   const {
  //     // @ts-ignore
  //     chat: { id: chatId },
  //     reply
  //   } = ctx;
  //   await serviceApi.removeUserReview({ chatId });
  //   await serviceApi.removeReview({ chatId });
  //   reply('All reviews are cleared!');
  // };

  return {
    setReview: chatErrorHandlerDecorator(
      Error,
      errorCb('setReview')
    )(setReview),
    endReview: chatErrorHandlerDecorator(
      Error,
      errorCb('endReview')
    )(endReview),
    checkStatus: chatErrorHandlerDecorator(
      Error,
      errorCb('checkStatus')
    )(checkStatus),
    checkAllStatus: chatErrorHandlerDecorator(
      Error,
      errorCb('checkAllStatus')
    )(checkAllStatus)
    // clearAllReviews: chatErrorHandlerDecorator(
    //   Error,
    //   errorCb('clearAllReviews')
    // )(clearAllReviews)
  };
};
