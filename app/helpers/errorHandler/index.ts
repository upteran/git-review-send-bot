import { TelegrafContext } from 'telegraf/typings/context';

import { ErrorHandlerFnType } from './types';

// TODO: add normal types
function handleError(
  ctx: any,
  errorClass: any,
  handler: ErrorHandlerFnType,
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

export const chatErrorHandlerDecorator =
  (errorClass: any, handler: ErrorHandlerFnType) =>
  (fn: Function) =>
  async (ctx: TelegrafContext) => {
    try {
      if (!ctx.from) throw new Error('No `from` field found on context');
      if (!ctx.chat) throw new Error('No `chat` field found on context');
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
      handleError(this, errorClass, handler, e);
    }
  };
