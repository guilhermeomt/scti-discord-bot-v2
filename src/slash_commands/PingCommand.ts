import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The gif category')
        .addChoice('Funny', 'gif_funny')
        .addChoice('Meme', 'gif_meme')
        .addChoice('Movie', 'gif_movie')),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow().addComponents(new MessageButton()
      .setCustomId('primary')
      .setLabel('Confirmar')
      .setStyle('SUCCESS')
      .setCustomId('1')
    );


    await interaction.reply({ content: 'Pong', components: [row] });
  },
};