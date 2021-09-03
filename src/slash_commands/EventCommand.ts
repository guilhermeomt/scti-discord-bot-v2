import { SlashCommandBuilder } from '@discordjs/builders';
import { Collection, CommandInteraction, MessageActionRow } from 'discord.js';
import { notion } from '../models/Notion';
import { Talk } from '../models/Talk';
import { Workshop } from '../models/Workshop';
import { Event, NewEventData } from '../models/Event';
import { eventManager } from '../models/EventManager';
import { component as confirmButton } from '../components/CreateEventButton';
import { component as discardButton } from '../components/DiscardEventButton';
import { component as selectMenu } from '../components/StartEventSelectMenu';
import { formatDate } from '../utils/formatDate';

export const command = new SlashCommandBuilder()
  .setName('eventos')
  .setDescription('Gerencia os eventos da SCTI')
  .addSubcommand(subcommand =>
    subcommand
      .setName('criar')
      .setDescription('Cria um evento')
      .addStringOption(option =>
        option
          .setName('notion_id')
          .setDescription('Notion ID do evento')
          .setRequired(true)
      ),

  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('iniciar')
      .setDescription('Inicia um evento (palestra ou workshop)')
  );

export const execute = async function (interaction: CommandInteraction, buffer: Collection<string, any>) {
  await interaction.deferReply();
  switch (interaction.options.getSubcommand()) {
    case 'criar':
      createEvent(interaction, buffer);
      break;
    case 'iniciar':
      startEvent(interaction);
      break;
    default:
      await interaction.editReply('Comando não encontrado');
  }
}

async function createEvent(interaction: CommandInteraction, buffer: Collection<string, any>) {
  const notionId = interaction.options.getString('notion_id');

  const eventData: NewEventData = await notion.getEventData(notionId);
  let event: Event = null;

  if (eventData.type === '1') {
    event = new Talk(eventData);
  } else if (eventData.type === '0') {
    event = new Workshop(eventData);
  } else {
    await interaction.editReply('Opa, ocorreu um erro ao criar o evento. Verefique se a página no Notion está preenchida corretamente.');
    return;
  }

  buffer.set(confirmButton.customId, event);

  const row = new MessageActionRow();
  row.addComponents([confirmButton, discardButton]);

  const eventTypeString = eventData.type === '1' ? 'Palestra' : 'Workshop';
  await interaction.editReply({
    content: `${eventTypeString} foi criado(a) com sucesso! Deseja confirmar o registro?`,
    embeds: [event.toMessageEmbed()],
    components: [row],
  });
}

async function startEvent(interaction: CommandInteraction) {

  const row = new MessageActionRow();

  const eventOptions = eventManager.events.mapValues(event => {
    return {
      label: event.title,
      description: formatDate(event.date),
      value: event.notionId,
    }
  });

  if (eventOptions.size === 0) {
    await interaction.editReply('Nenhum evento foi criado ainda!');
    return;
  }

  selectMenu.addOptions([...eventOptions.values()]);

  row.addComponents([selectMenu]);
  await interaction.editReply({ content: 'Selecione o evento:', components: [row] });
}