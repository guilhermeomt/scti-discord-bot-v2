import { Collection, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { eventManager } from "../models/EventManager";

export const component = new MessageSelectMenu()
  .setCustomId('sm1')
  .setPlaceholder('Nenhuma opção selecionada')

export async function execute(interaction: SelectMenuInteraction, buffer: Collection<string, any>) {
  const eventNotionId = interaction.values[0];

  const event = eventManager.events.find(event => event.notionId === eventNotionId);

  if (!event) {
    await interaction.update({ content: "Algo deu errado...", components: [] });
    return;
  }

  await interaction.update({ content: "Iniciado...", components: [] });
  //event.createChannels();

}