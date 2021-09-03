import { ButtonInteraction, Collection, MessageButton } from "discord.js";
import { Event } from "../models/Event";
import { eventManager } from "../models/EventManager";

export const component = new MessageButton()
  .setCustomId("btn1")
  .setLabel("Confirmar")
  .setStyle("SUCCESS");

export async function execute(interaction: ButtonInteraction, buffer: Collection<string, any>) {
  const event: Event = buffer.get(interaction.customId);
  buffer.delete(interaction.customId);

  eventManager.addEvent(event);

  await interaction.update({ content: `O evento "${event.title}" foi registrado!`, components: [], embeds: [] });
}