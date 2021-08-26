import { RunFunction } from '../interfaces/RunFunction';
import { CommandInteraction } from 'discord.js'
import { Bot } from '../client';

export const run: RunFunction = async (client: Bot, interaction: CommandInteraction) => {
  if (interaction.isButton()) {

    await interaction.update({ components: [], content: 'Confirmado!' });
  }

  if (!interaction.isCommand()) return;

  const command = client.slash_commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

export const name: string = 'interactionCreate';
