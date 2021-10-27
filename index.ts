import { bot } from './app/config/telegram';
import { addBotCommands } from './app/services/tgService';
import { groupCommands } from './app/controllers/groupController';
import { reviewCommands } from './app/controllers/reviewController';

addBotCommands([...groupCommands, ...reviewCommands], bot);

bot.startPolling();

console.log('Hello, start bot');
