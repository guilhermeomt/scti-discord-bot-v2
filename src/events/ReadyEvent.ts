import { RunFunction } from '../interfaces/RunFunction';

export const run: RunFunction = async (client) => {
  console.log(`${client?.user?.tag} está online!`);
};

export const name: string = 'ready';
