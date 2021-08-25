import axios from 'axios';
import { Message } from 'discord.js';
import { RunFunction } from '../interfaces/RunFunction';

export const run: RunFunction = async (client, message: Message, args: string[]) => {
  const { channel } = message;
  channel.send('Foto de um cachorro a caminho...');
  const res = await axios.get(' https://dog.ceo/api/breeds/image/random');
  channel.send('Aqui está!', { files: [res.data.message] });
};

export const name: string = 'cachorro';
