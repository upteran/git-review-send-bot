import Telegraf from 'telegraf';

import { addBotCommands } from './app/services/tgService';
import { groupCommands } from './app/controllers/groupController';
import { reviewCommands } from './app/controllers/reviewController';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./config.json');

const bot = new Telegraf(config.telegramApiKey, {
  username: config.botUsername
});

addBotCommands([...groupCommands, ...reviewCommands], bot);

bot.startPolling();

console.log('Hello, start bot');
