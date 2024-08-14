import { Context as TelegrafContext } from 'telegraf/typings/context';
import User from '../../models/User';
import { IGroupServiceApi } from '../../api/types';
import { chatErrorHandlerDecorator } from '../../helpers/errorHandler';

interface IGroupService {
  registrationUser: (ctx: any) => void;
  enableUser: (ctx: any) => void;
  disableUser: (ctx: any) => void;
}

const errorCb = (name: string) => (e: any) => {
  console.error(`error handler log ${name}`, e);
};

export const groupService = (api: IGroupServiceApi): IGroupService => {
  // init api
  const serviceApi = api;

  const registrationUser = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    // @ts-ignore
    const { id, username, first_name } = ctx.update.message.from;

    // const isCurrUserExist = !!(await serviceApi.getUser({ chatId, id }));
    // if (isCurrUserExist) {
    //   ctx.reply('User already exist!');
    //   return;
    // }
    // TODO: add check to registr before user
    const user = new User(id, username || first_name);
    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];

    await serviceApi.addUserToGroup({ id, chatId }, user);
    // TODO: realize Map collection
    if (!reviewQueue.includes(id)) {
      reviewQueue.push(id);
    }
    await serviceApi.addReviewQueue({ chatId }, reviewQueue);

    ctx.reply(`Welcome to team!`);
  };

  const enableUser = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    // @ts-ignore
    const { id } = ctx.update.message.from;
    await serviceApi.updateUser({ id, chatId }, { status: 'active' });
    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];
    // TODO: realize Map collection
    if (!reviewQueue.includes(id)) {
      reviewQueue.push(id);
    }
    await serviceApi.addReviewQueue({ chatId }, reviewQueue);
    ctx.reply(`You are opt in now!`);
  };

  const disableUser = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      chat: { id: chatId }
    } = ctx;
    // @ts-ignore
    const { id } = ctx.update.message.from;
    const activeReview = await serviceApi.getUsersReview({ id, chatId });

    if (activeReview) {
      ctx.reply(`You have got active MR, close it before out`);
      return;
    }

    const reviewQueue = (await serviceApi.getReviewQueue({ chatId })) || [];
    const filteredQueue = reviewQueue.filter(userId => userId !== id);
    await serviceApi.addReviewQueue({ chatId }, filteredQueue);
    await serviceApi.updateUser({ id, chatId }, { status: 'disable' });
    ctx.reply(`You are opt out now!`);
  };

  return {
    registrationUser: chatErrorHandlerDecorator(
      Error,
      errorCb('registrationUser')
    )(registrationUser),
    enableUser: chatErrorHandlerDecorator(
      Error,
      errorCb('enableUser')
    )(enableUser),
    disableUser: chatErrorHandlerDecorator(
      Error,
      errorCb('disableUser')
    )(disableUser)
  };
};
