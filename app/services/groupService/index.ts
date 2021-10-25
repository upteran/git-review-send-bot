import { TelegrafContext } from 'telegraf/typings/context';
import User from '../../models/user/User';
import { GroupApiType } from '../../api/types';

interface IGroupService {
  registrationUser: Function;
  enableUser: Function;
  disableUser: Function;
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
    registrationUser: errorHandlerDecorator(Error, e =>
      console.log('error reg', e)
    )(registrationUser),
    enableUser: errorHandlerDecorator(Error, () =>
      console.log('error enableUser')
    )(enableUser),
    disableUser: errorHandlerDecorator(Error, () =>
      console.log('error disableUser')
    )(disableUser)
  };
};
