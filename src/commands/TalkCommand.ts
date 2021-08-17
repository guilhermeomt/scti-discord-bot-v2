import { Message } from 'discord.js';
import { Bot } from '../client';
import { Talk } from '../models/Talk';
import { RunFunction } from '../interfaces/RunFunction';
import { SubCommand } from '../interfaces/SubCommand';

async function createTalk(message: Message, args: string[], client: Bot) {
  if (args.length < 2) {
    throw new Error(`Parametros inválidos, certifique-se de mandar \`\`\`${process.env.CMD_PREFIX}palestra --criar nome quantidade_de_salas\`\`\``);
  }

  const name = args[0];
  const date = new Date();
  const roomsCount = parseInt(args[1]);

  const talk = new Talk(name, date, roomsCount);

  client.talks.push(talk);

  await talk.createChannels(message);
}

export const run: RunFunction = async (client: Bot, message: Message, args: string[]) => {
  const subCommand = args.shift();

  subcommands.map(subCmd => {
    if (subCmd.name === subCommand) {
      subCmd
        .run(message, args, client)
        .catch(async err => {
          await message.channel.send(err.message);
        });
    }
  })
};

export const name: string = 'palestra';

export const subcommands: SubCommand[] = [
  {
    name: '--criar',
    value: 'criar',
    run: createTalk,
  }
]