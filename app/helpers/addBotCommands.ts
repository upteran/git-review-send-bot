import Telegraf from 'telegraf';

export type Command = {
  name: string;
  cb: Function;
};

// @ts-ignore
export function addBotCommands(commands: Array<Command>, bot: Telegraf): void {
  commands.forEach(({ name, cb }) => {
    bot.command(name, cb);
  });
}
