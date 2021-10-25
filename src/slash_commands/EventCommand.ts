import { SlashCommandBuilder } from '@discordjs/builders';
import { Collection, CommandInteraction, MessageActionRow } from 'discord.js';
import { notion } from '../models/Notion';
import { Event, EventStatus } from '../models/Event';
import { component as confirmButton } from '../components/CreateEventButton';
import { component as discardButton } from '../components/DiscardEventButton';
import { component as selectMenu } from '../components/StartEventSelectMenu';
import { formatDate } from '../utils/formatDate';

export const command = new SlashCommandBuilder()
  .setName('eventos')
  .setDescription('Gerencia os eventos da SCTI')
  .addSubcommand(subcommand =>
    subcommand
      .setName('cadastrar')
      .setDescription('Cadastra um novo evento')
      .addStringOption(option =>
        option
          .setName('notion_id')
          .setDescription('Notion ID do evento ou use * encontrar eventos automaticamente')
          .setRequired(true)
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('iniciar')
      .setDescription('Inicia um evento (palestra ou workshop)')
      .addChannelOption(option =>
        option
          .setName('canal_categoria')
          .setDescription('Selecione a categoria a qual será criada as salas do evento')
      )
  );


export const execute = async function (interaction: CommandInteraction, buffer: Collection<string, any>) {
  await interaction.deferReply();

  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'cadastrar':
      createEvent(interaction, buffer);
      break;
    case 'iniciar':
      startEvent(interaction, buffer);
      break;
    default:
      await interaction.editReply('Comando não encontrado');
  }
}

async function createEvent(interaction: CommandInteraction, buffer: Collection<string, any>) {
  const notionId = interaction.options.getString('notion_id');

  try {
    const existingEvent = await Event.findByPk(notionId, { attributes: ['notionId'] })

    if (existingEvent) {
      await interaction.editReply('Já existe um evento com este ID.');
      return;
    }

    const eventData = await notion.getEventData(notionId);

    const event: Event = Event.build(eventData);

    const row = new MessageActionRow();
    row.addComponents([confirmButton, discardButton]);
    buffer.set(confirmButton.customId, event);

    await interaction.editReply({
      content: `${event.getTalkType()} foi criado(a) com sucesso! Deseja confirmar o registro?`,
      embeds: [event.toMessageEmbed()],
      components: [row],
    });
  } catch (err) {
    await interaction.editReply('Desculpa! Não foi possível criar o evento...');
  }
}

async function startEvent(interaction: CommandInteraction, buffer: Collection<string, any>) {
  const row = new MessageActionRow();

  const categoryChannel = interaction.options.getChannel('canal_categoria');

  if (categoryChannel) {
    buffer.set(selectMenu.customId, categoryChannel.id);
  }

  try {
    const events = await Event.findAll({ where: { status: EventStatus.NOT_STARTED } });

    const eventOptions = events.map(event => {
      return {
        label: event.title,
        description: formatDate(new Date(event.date)),
        value: event.notionId,
      }
    });

    if (eventOptions.length === 0)
      return await interaction.editReply('Nenhum evento foi criado ainda!');

    selectMenu.addOptions(eventOptions);
    row.addComponents([selectMenu]);

    await interaction.editReply({ content: 'Selecione o evento:', components: [row] });
  } catch (err) {
    await interaction.editReply('Opa... ocorreu um erro!');
  }
}