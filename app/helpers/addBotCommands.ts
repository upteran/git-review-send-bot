import { Telegraf } from 'telegraf';
import { Context } from 'telegraf/typings/context';

export type Command = {
  name: string;
  cb: (ctx: Context) => void;
};

export function addBotCommands(commands: Array<Command>, bot: Telegraf): void {
  commands.forEach(({ name, cb }: Command) => {
    bot.command(name, cb);
  });
}
