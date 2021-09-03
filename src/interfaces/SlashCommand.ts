import { Collection, CommandInteraction } from "discord.js";
import { APIApplicationCommandOption } from 'discord-api-types/v9';

export interface SlashCommand {
  command: {
    name: string;
    description: string;
    options: APIApplicationCommandOption[];
    default_permission: boolean;
  },
  execute: (interaction: CommandInteraction, buffer: Collection<string, any>) => Promise<void>;
}
