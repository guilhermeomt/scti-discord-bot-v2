import { Message } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';

export const run: RunFunction = async (client, message: Message) => {
  const msg = await message.channel.send('Pingando!!');
};

export const name: string = 'ping';
