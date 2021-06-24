import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';
import { RunFunction } from '../interfaces/RunFunction';

export const run: RunFunction = async (client, message: Message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = process.env.CMD_PREFIX;

  const args: string[] = message.content
    .slice(prefix?.length)
    .trim()
    .split(/ +/g);
  const cmd: string | undefined = args.shift();
  const command: Command | undefined = client.commands.get(cmd as string);
  if (!command) return;

  command
    .run(client, message, args)
    .catch((reason: any) => message.channel.send(`Erro: ${reason}!`));
};

export const name: string = 'message';
