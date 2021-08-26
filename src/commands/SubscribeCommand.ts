import { Message } from 'discord.js';
import validator from 'validator';
import { RunFunction } from '../interfaces/RunFunction';
import { notion } from '../models/Notion';

async function getParticipantData(message: Message) {
  const user = message.author;

  try {
    const dmChannel = await user.createDM();

    const welcomeMessage = `Olá! Bem-vindo a SCTI 2021! Vamos realizar o seu cadastro?\nPor favor, me informe seu nome completo. Atenção: o nome que você digitar será utilizado para a emissão do certificado. Você poderá alterar depois ao entrar em contato com algum administrador.`
    await dmChannel.send(welcomeMessage);

    let answer = await dmChannel.awaitMessages({ max: 1, time: 30000 })

    const name = answer.first().content;

    await dmChannel.send(`Agora digite seu email, por favor.`);

    answer = await dmChannel.awaitMessages({ max: 1, time: 30000 });

    const email = answer.first().content;

    if (!email || !validator.isEmail(email)) {
      await message.channel.send(`Por favor, informe o seu email corretamente. Tente realizar novamente o cadastro com o comando \`${process.env.CMD_PREFIX}registrar\``);
      return;
    }

    return {
      id: user.id,
      name,
      nickname: user.tag,
      email,
    }
  } catch (err) {
    await user.send(`Opa, algo deu errado! Por favor, tente novamente.`);
  }
}

export const run: RunFunction = async (client, message: Message, args: string[]) => {
  if (message.channel.type === 'DM') {
    try {
      const participant = await getParticipantData(message);

      if (!participant) return;

      await notion.subscribe(participant);

      await message.channel.send(`Obrigado por se inscrever!`);
    } catch (error) {
      await message.channel.send(`Desculpa! Ocorreu um erro... Tente novamente mais tarde ou entre em contato com algum administrador.`);
    }
  }
};

export const name: string = 'registrar';
