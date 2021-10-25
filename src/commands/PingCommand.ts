import { Message } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';
import { Event } from '../models/Event';


export const run: RunFunction = async (client, message: Message, args: string[]) => {
  try {
    const e = await Event.findByPk(args[0]);

    await message.channel.send({ embeds: [e.toMessageEmbed()] });

  } catch (err) {
    console.log(err);
  }
};

export const name: string = 'ping';
