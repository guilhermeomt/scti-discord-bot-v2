import { promisify } from 'util';
import { RunFunction } from '../interfaces/RunFunction';
import { Event } from '../models/Event';
import Participant from '../models/Participant';

const wait = promisify(setTimeout);

export const run: RunFunction = async (client) => {
  await wait(750);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  client.invites = (await guild?.invites.fetch()) as any;

  await Participant.sync();
  await Event.sync();

  console.log(`${client?.user?.tag} está online! Bot iniciado com sucesso!`);
};

export const name: string = 'ready';
