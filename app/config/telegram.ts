import Telegraf from 'telegraf';

import { devConfig } from './devConfig';

const apiKey = process.env.TELEGRAM_API_KEY || devConfig.telegramApiKey;
const botUsername = process.env.BOT_USERNAME || devConfig.botUsername;

export const bot = new Telegraf(apiKey, {
  username: botUsername
});
