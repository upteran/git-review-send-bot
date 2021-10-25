import Telegraf from 'telegraf';

import { addBotCommands } from './app/services/tgService';
import { groupService } from './app/services/groupService';
import { reviewService } from './app/services/reviewService';
import { groupApi, reviewApi } from './app/api';
// import { reviewService } from './app/services/reviewService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./config.json');

const bot = new Telegraf(config.telegramApiKey, {
  username: config.botUsername
});

const group = groupService(groupApi);
const review = reviewService(reviewApi);

const list = [
  {
    name: 'reg',
    cb: group.registrationUser
  },
  {
    name: 'in',
    cb: group.enableUser
  },
  {
    name: 'out',
    cb: group.disableUser
  },
  {
    name: 'review',
    cb: review.setReview
  },
  {
    name: 'end_review',
    cb: review.endReview
  },
  {
    name: 'check_status',
    cb: review.checkStatus
  },
  {
    name: 'check_all',
    cb: review.checkAllStatus
  }
  // {
  //   name: 'clear_all',
  //   cb: review.clearAllReviews
  // }
];

addBotCommands(list, bot);

bot.startPolling();

console.log('Hello, start bot');
