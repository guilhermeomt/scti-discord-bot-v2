import { Client, Collection, Invite } from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { Command } from './interfaces/Command';
import { Config } from './interfaces/Config';
import { Event } from './interfaces/Event';

const globPromise = promisify(glob);

class Bot extends Client {
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public invites: Collection<string, Invite> = new Collection();
  public config: Config | undefined;

  public constructor() {
    super();
  }

  public async loadCommands(): Promise<void> {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/commands/**/*{.ts,.js}`
    );

    commandFiles.map(async (value: string) => {
      const file: Command = await import(value);
      this.commands.set(file.name, file);
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
  }
}

export { Bot };
