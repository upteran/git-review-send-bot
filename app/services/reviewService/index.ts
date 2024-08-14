/* eslint-disable */
import { Context as TelegrafContext } from 'telegraf/typings/context';
import { nanoid } from 'nanoid';

import Review from '../../models/Review';
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
      chat: { id: chatId },
      message
    } = ctx;

    // @ts-ignore
    const { id: authorId } = ctx.update.message.from;
    const msg = getUserMessage(message);

    if (!msg || !msg.length) {
      ctx.reply('Need merge request link!');
      return;
    }

    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];
    let authorQueueIdx = -1;
    const excludeUserQueue = reviewQueue.filter((id, idx) => {
      if (id !== authorId) return id;
      authorQueueIdx = idx;
    });

    if (!excludeUserQueue.length) {
      return ctx.reply('Everybody busy');
    }

    const reviewId = nanoid();
    const review = new Review(reviewId, msg, authorId);
    const nextUserId = excludeUserQueue.shift();
    if(authorQueueIdx !== -1) {
      excludeUserQueue.splice(authorQueueIdx, 0, authorId)
    }
    await serviceApi.addReview({ id: reviewId, chatId }, review);
    await serviceApi.addUserReview({ id: nextUserId, chatId }, reviewId);
    await serviceApi.addReviewQueue({ chatId }, excludeUserQueue);

    const user = await serviceApi.getUser({ chatId, id: nextUserId });

    ctx.reply(
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
      chat: { id: chatId }
    } = ctx;

    // @ts-ignore
    const { id } = ctx.update.message.from;
    const userReviewId = await serviceApi.getUsersReview({ id, chatId });
    await serviceApi.removeUserReview({ id, chatId });
    await serviceApi.removeReview({ id: userReviewId, chatId });

    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];
    if (!reviewQueue.includes(id)) {
      reviewQueue.push(id);
    }
    await serviceApi.addReviewQueue({ chatId }, reviewQueue);

    const user = await serviceApi.getUser({ chatId, id });

    ctx.reply(`dobby if free ${parseHtmlName(user.username, user.id)}`, {
      parse_mode: 'HTML'
    });
  };

  const checkStatus = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    // @ts-ignore
    const { id } = ctx.update.message.from;
    const reviewId = await serviceApi.getUsersReview({ id, chatId });
    const review = await serviceApi.getReview({ id: reviewId, chatId });
    const user = await serviceApi.getUser({ chatId, id });

    let msg = `${parseName(user.username, id)}, haven't any MR to review`;
    if (review) {
      msg = `${parseName(user.username, id)}, [you have active MR to review = ${
        review.msg
      }]`;
    }

    ctx.reply(msg, {
      parse_mode: 'Markdown'
    });
  };

  const checkAllStatus = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    // @ts-ignore
    const { id } = ctx.update.message.from;
    const reviewsMap = await serviceApi.getUsersReviewList({ chatId });

    if (!reviewsMap) {
      ctx.reply('All users are available');
      return;
    }
    const users = await serviceApi.getUsersList({ chatId });
    const reviews = await serviceApi.getReviewsList({ chatId });
    Object.keys(reviewsMap).forEach(userId => {
      const currUser = users[userId];
      const currReview = reviews[reviewsMap[userId]];
      if (currReview) {
        ctx.reply(
          `${parseHtmlName(currUser.username, id)}: MR - ${currReview.msg}`,
          {
            parse_mode: 'HTML'
          }
        );
      } else {
        ctx.reply(
          `${parseHtmlName(currUser.username, id)}: need review something`,
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
      chat: { id: chatId }
    } = ctx;
    const queue: Array<number> = [];
    const users = (await serviceApi.getUsersList({ chatId })) || [];
    Object.keys(users).forEach(key => {
      const user = users[key];
      queue.push(user.id);
    });
    await serviceApi.removeUserReview({ chatId });
    await serviceApi.removeReview({ chatId });
    await serviceApi.addReviewQueue({ chatId }, queue);
    ctx.reply('All reviews are cleared!');
  };

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
    )(checkAllStatus),
    clearAllReviews: chatErrorHandlerDecorator(
      Error,
      errorCb('clearAllReviews')
    )(clearAllReviews)
  };
};
