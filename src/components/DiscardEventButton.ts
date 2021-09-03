import { ButtonInteraction, Collection, MessageButton } from "discord.js";

export const component = new MessageButton()
  .setCustomId("btn2")
  .setLabel("Descartar")
  .setStyle("DANGER");

export async function execute(interaction: ButtonInteraction, buffer: Collection<string, any>) {
  buffer.delete(interaction.customId);

  await interaction.update({ content: `O evento foi descartado.`, components: [], embeds: [] });
}