import { promisify } from 'util';
import { RunFunction } from '../interfaces/RunFunction';

const wait = promisify(setTimeout);

export const run: RunFunction = async (client) => {
  await wait(750);
  const { GUILD_ID } = process.env as any;
  const guild = client.guilds.cache.get(GUILD_ID);
  client.invites = (await guild?.fetchInvites()) as any;
  console.log(`${client?.user?.tag} está online! Bot iniciado com sucesso!`);
};

export const name: string = 'ready';
