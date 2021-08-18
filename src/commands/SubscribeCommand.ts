import { Message } from 'discord.js';
import validator from 'validator';
import { RunFunction } from '../interfaces/RunFunction';
import { notion } from '../models/Notion';

export const run: RunFunction = async (client, message: Message, args: string[]) => {

  if (message.channel.type === 'dm') {

    const user = message.author;

    const name = args.shift();
    const email = args.shift();

    if (!email || !validator.isEmail(email)) {
      await message.channel.send(`Por favor, informe o seu email corretamente.`);
      return;
    }

    const participant = {
      id: user.id,
      name,
      nickname: user.tag,
      email,
    }

    try {
      const page = await notion.subscribe(participant);
    } catch (error) {
      await message.channel.send(`Desculpa! Ocorreu um erro... tente novamente mais tarde.`);
      return;
    }
  }
};

export const name: string = 'registrar';
