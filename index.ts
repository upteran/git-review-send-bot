import Telegraf from 'telegraf';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { tgConfig } from './app/config/telegram';
import { addBotCommands } from './app/helpers/addBotCommands';
import { groupCommands } from './app/controllers/groupController';
import { reviewCommands } from './app/controllers/reviewController';

const { apiKey } = tgConfig;

export function initBot(): void {
  if (!apiKey) {
    console.error('Bot init config error');
    return;
  }
  const bot = new Telegraf(apiKey);
  addBotCommands([...groupCommands, ...reviewCommands], bot);
  bot.launch();
  console.log('\nStart bot');
}

initBot();
