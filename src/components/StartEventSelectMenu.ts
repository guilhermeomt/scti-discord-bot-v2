import { Collection, Message, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { Event } from "../models/Event";
import { eventManager } from "../models/EventManager";

export const component = new MessageSelectMenu()
  .setCustomId('sm1')
  .setPlaceholder('Nenhuma opção selecionada')

export async function execute(interaction: SelectMenuInteraction, buffer: Collection<string, any>) {
  component.spliceOptions(0, component.options.length);
  const eventNotionId = interaction.values[0];

  try {
    const event = await Event.findOne({ where: { notionId: eventNotionId } });
    if (!event)
      return await interaction.update({ content: "Algo deu errado...", components: [] });

    const categoryChannelId = buffer.get(interaction.customId);
    await interaction.update({ content: "Iniciando...", components: [] });

    await event.start(interaction.message as Message, categoryChannelId);
    eventManager.addEvent(event);
  } catch (err) {
    await interaction.update({ content: "Algo deu errado...", components: [] });
    console.log(err);
  }
}