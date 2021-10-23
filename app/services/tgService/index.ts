import Telegraf from 'telegraf';

import { Command } from './types';

// @ts-ignore
export function addBotCommands(commands: Array<Command>, bot: Telegraf): void {
  commands.forEach(({ name, cb }) => {
    bot.command(name, cb);
  });
}
