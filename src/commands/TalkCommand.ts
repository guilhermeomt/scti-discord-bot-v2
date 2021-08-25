import { Message } from 'discord.js';
import { Bot } from '../client';
import { Talk } from '../models/Talk';
import { talkManager } from '../models/TalkManager';
import { RunFunction } from '../interfaces/RunFunction';
import { SubCommand } from '../interfaces/SubCommand';
import { notion } from '../models/Notion';

async function createTalk(message: Message, args: string[], client: Bot) {
  if (args.length < 1) {
    message.reply('digite o ID do Notion referente à palestra a ser cadastrada.');
    return;
  }

  const talkId = args[0];
  const talkData = await notion.getTalkData(talkId);
  const talk = new Talk(talkData.title, talkData.date, talkData.notionId, talkData.speakers);

  const { channel } = message;
  await channel.send(talk.toEmbed());
  await channel.send('Deseja confirmar o cadastro da palestra acima? (y/n)');

  const answer = await channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });

  if (answer.first().content === 'y') {
    const talkToken = talkManager.addTalk(talk);
    await channel.send('Cadastro realizado com sucesso! Sempre que for referenciar esta palestra use o token: ' + talkToken);
  }
}

async function startTalk(message: Message, args: string[], client: Bot) {

  const talk = talkManager.getNextTalk();

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
    name: '--cadastrar',
    value: 'cadastrar',
    run: createTalk,
  },
  {
    name: '--iniciar',
    value: 'iniciar',
    run: startTalk,
  }
]