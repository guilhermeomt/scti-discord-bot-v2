import { ButtonInteraction, Collection, MessageButton } from "discord.js";
import { Event } from "../models/Event";

export const component = new MessageButton()
  .setCustomId("btn1")
  .setLabel("Confirmar")
  .setStyle("SUCCESS");

export async function execute(interaction: ButtonInteraction, buffer: Collection<string, any>) {
  try {
    const event: Event = buffer.get(interaction.customId);
    buffer.delete(interaction.customId);

    await event.save();

    await interaction.update({ content: `O evento "${event.title}" foi registrado!`, components: [], embeds: [] });
  } catch (err) {
    console.log(err);
  }
}