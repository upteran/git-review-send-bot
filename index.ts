import Telegraf from 'telegraf';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { tgConfig } from './app/config/telegram';
import { addBotCommands } from './app/helpers/addBotCommands';
import { groupCommands } from './app/controllers/groupController';
import { reviewCommands } from './app/controllers/reviewController';

const { apiKey, botUsername } = tgConfig;

export function initBot(): void {
  if (!apiKey || !botUsername) {
    console.error('Bot init config error');
    return;
  }
  const bot = new Telegraf(apiKey, {
    // @ts-ignore
    username: botUsername
  });
  addBotCommands([...groupCommands, ...reviewCommands], bot);
  bot.startPolling();
  console.log('\nStart bot');
}

initBot();
