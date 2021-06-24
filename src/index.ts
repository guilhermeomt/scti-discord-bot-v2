import dotenv from 'dotenv';
import { Bot } from './client';

dotenv.config();

const bot = new Bot();

if (process.env.DISCORD_BOT_TOKEN) {
  bot.start({ token: process.env.DISCORD_BOT_TOKEN });
} else {
  throw new Error('Invalid or missing Discord access token');
}
