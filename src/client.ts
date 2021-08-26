import { Client, Collection, Invite, Intents, CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { APIApplicationCommandOption, Routes } from 'discord-api-types/v9';
import glob from 'glob';
import { promisify } from 'util';
import { Command } from './interfaces/Command';
import { Config } from './interfaces/Config';
import { Event } from './interfaces/Event';

const globPromise = promisify(glob);

interface SlashCommand {
  data: {
    name: string;
    description: string;
    options: APIApplicationCommandOption[];
    default_permission: boolean;
  },
  execute: (interaction: CommandInteraction) => Promise<void>;
}

class Bot extends Client {
  public commands: Collection<string, Command> = new Collection();
  public slash_commands: Collection<string, SlashCommand> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public invites: Collection<string, Invite> = new Collection();
  public config: Config | undefined;
  public bot_rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);


  public constructor() {
    super({ intents: [Intents.FLAGS.GUILDS] });
  }

  public async loadCommands(): Promise<void> {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/commands/**/*{.ts,.js}`
    );

    const slashCommandFiles: string[] = await globPromise(
      `${__dirname}/slash_commands/**/*{.ts,.js}`
    );

    commandFiles.map(async (value: string) => {
      const file: Command = await import(value);
      this.commands.set(file.name, file);
    });

    slashCommandFiles.map(async (value: string) => {
      const file = await import(value);
      this.slash_commands.set(file.data.name, file);
    });
  }

  public async loadEvents(): Promise<void> {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/events/**/*{.ts,.js}`
    );

    eventFiles.map(async (value: string) => {
      const file: Event = await import(value);
      this.events.set(file.name, file);
      this.on(file.name, file.run.bind(null, this));
    });
  }

  public async start(config: Config): Promise<void> {
    this.config = config;
    this.login(config.token);
    await this.loadCommands();
    await this.loadEvents();
    const filteredSlashCommands = [...this.slash_commands.values()].map((value: SlashCommand) => value.data);
    console.log(filteredSlashCommands);
    await this.bot_rest.put(Routes.applicationGuildCommands('760889062009077820',
      '846373225176236073'),
      { body: filteredSlashCommands })
  }
}

export { Bot };
