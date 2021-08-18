import { Message } from 'discord.js';
import validator from 'validator';
import { RunFunction } from '../interfaces/RunFunction';
import { notion } from '../models/Notion';

export const run: RunFunction = async (client, message: Message, args: string[]) => {
  if (message.channel.type === 'dm') {

    const user = message.author;

    // TODO: Do a more friendly way to gather user input 
    const name = args.shift();
    const email = args.shift();
    const githubURL = args.shift();

    if (!email || !validator.isEmail(email)) {
      await message.channel.send(`Por favor, informe o seu email corretamente.`);
      return;
    }

    const participant = {
      id: user.id,
      name,
      nickname: user.tag,
      email,
      githubURL,
    }

    try {
      const page: any = await notion.subscribe(participant);

      await message.channel.send(`Obrigado por se inscrever! O seu perfil está disponível em ${page.url}`);
    } catch (error) {
      await message.channel.send(`Desculpa! Ocorreu um erro... tente novamente mais tarde.`);
      return;
    }
  }

};

export const name: string = 'registrar';
