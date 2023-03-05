import Telegraf from 'telegraf';
import http from 'http';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { tgConfig } from './app/config/telegram';
import { addBotCommands } from './app/helpers/addBotCommands';
import { groupCommands } from './app/controllers/groupController';
import { reviewCommands } from './app/controllers/reviewController';

function runServer() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 8080;

  const requestListener = function (req: any, res: any) {
    res.writeHead(200);
    res.end('Ok');
  };

  const server = http.createServer(requestListener);
  // @ts-ignore
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

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
runServer();
