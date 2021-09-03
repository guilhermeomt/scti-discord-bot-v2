import { RunFunction } from '../interfaces/RunFunction';
import { Collection, CommandInteraction } from 'discord.js'
import { Bot } from '../client';

const buffer: Collection<string, any> = new Collection();

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
  if (interaction.isMessageComponent()) {
    const component = client.components.find(c => c.component.customId === interaction.customId)

    if (component) {
      component.execute(interaction, buffer);
    }
  }

  if (!interaction.isCommand()) return;

  const command = client.slash_commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, buffer);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Opa! Ocorreu um erro ao executar esse comando...', ephemeral: true });
  }
};

export const name: string = 'interactionCreate';
