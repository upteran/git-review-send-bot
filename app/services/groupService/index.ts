import { TelegrafContext } from 'telegraf/typings/context';
import User from '../../models/user/User';
import { GroupApiType } from '../../api/types';
import { chatErrorHandlerDecorator } from '../../helpers/errorHandler';

interface IGroupService {
  registrationUser: Function;
  enableUser: Function;
  disableUser: Function;
}

const errorCb = (name: string) => (e: any) => {
  console.error(`error handler log ${name}`, e);
};

export const groupService = (api: {
  getReviewQueue: (apiConfig: GroupApiType) => Array<number>;
  addUserToGroup: (apiConfig: GroupApiType, user: User) => void;
  updateUser: (apiConfig: GroupApiType, params: object) => void;
  updateReviewQueue: (
    apiConfig: GroupApiType,
    reviewQueue: Array<number>
  ) => void;
}): IGroupService => {
  // init api
  const serviceApi = api;

  const registrationUser = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id, username, first_name },
      // @ts-ignore
      chat: { id: chatId },
      reply
    } = ctx;

    const user = new User(id, username || first_name);
    const reviewQueue = await serviceApi.getReviewQueue({ chatId });
    console.log('registrationUser', reviewQueue);

    serviceApi.addUserToGroup({ id, chatId }, user);
    reviewQueue.push(id);
    serviceApi.updateReviewQueue({ chatId }, reviewQueue);

    reply(`Welcome to team!`);
  };

  const enableUser = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id },
      // @ts-ignore
      chat: { id: chatId },
      reply
    } = ctx;
    serviceApi.updateUser({ id, chatId }, { status: 'active' });
    const reviewQueue = await serviceApi.getReviewQueue({ chatId });
    reviewQueue.push(id);
    serviceApi.updateReviewQueue({ chatId }, reviewQueue);
    reply(`You are opt in now!`);
  };

  const disableUser = async (ctx: TelegrafContext) => {
    const {
      // @ts-ignore
      from: { id },
      // @ts-ignore
      chat: { id: chatId },
      reply
    } = ctx;
    serviceApi.updateUser({ id, chatId }, { status: 'disable' });
    const reviewQueue = await serviceApi.getReviewQueue({ chatId });
    const filteredQueue = reviewQueue.filter(userId => userId !== id);
    serviceApi.updateReviewQueue({ chatId }, filteredQueue);
    reply(`You are opt out now!`);
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
