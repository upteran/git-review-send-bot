import { Telegraf } from 'telegraf';

export type Command = {
  name: string;
  cb: (ctx: any) => void;
};

export function addBotCommands(commands: Array<Command>, bot: Telegraf): void {
  commands.forEach(({ name, cb }: Command) => {
    bot.command(name, cb);
  });
}
