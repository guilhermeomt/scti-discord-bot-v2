import { Collection, CommandInteraction, MessageButton, MessageSelectMenu } from "discord.js";

export interface Component {
  component: MessageButton | MessageSelectMenu;
  execute: (interaction: CommandInteraction, buffer: Collection<string, any>) => Promise<void>;
}