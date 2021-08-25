import { Message } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';
import { notion } from '../models/Notion';
import { notionService } from '../services/NotionService';

export const run: RunFunction = async (client, message: Message) => {
  await message.channel.send('Pingando!!');

  const { id } = message.author;

  // await notion.confirmPresence('23502f758f0444839037fa1f040190b5', id);
};

export const name: string = 'ping';
