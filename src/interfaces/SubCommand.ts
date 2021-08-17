import { Message } from 'discord.js';
import { Bot } from '../client';

export interface SubCommand {
  name: string;
  value: string;
  run: (message: Message, args: string[], client?: Bot) => Promise<void>;
}
