import axios from 'axios';
import { Message } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';

export const run: RunFunction = async (client, message: Message, args: string[]) => {
  const { channel } = message;
  await channel.send('Foto de um cachorro a caminho...');
  const res = await axios.get(' https://dog.ceo/api/breeds/image/random');
  await channel.send({ content: 'Aqui está!', files: [res.data.message] });
};

export const name: string = 'cachorro';
