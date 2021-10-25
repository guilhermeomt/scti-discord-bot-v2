import { Message, MessageEmbed } from "discord.js";
import Sequelize, { Model } from 'sequelize';
import { formatDate } from "../utils/formatDate";
import db from '../services/Database'

export enum EventType {
  TALK,
  WORKSHOP
}

export enum EventStatus {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
}

export type NewEventData = {
  title: string;
  type: number;
  date: Date;
  code: string;
  notionId: string;
  speakers: string[];
}

export class Event extends Model {
  title: string;
  date: Date;
  type: EventType;
  notionId: string;
  code: string;
  speakers: string[];
  status: EventStatus = EventStatus.NOT_STARTED;
  roomsCount: number = 3;
  readonly roomsChannelId: string[] = [];


  public async start(message: Message, categoryChannelId: string): Promise<void> {
    await this.createChannels(message, categoryChannelId);
  }

  private async createChannels(message: Message, categoryChannelId: string): Promise<void> {
    for (let i = 1; i <= this.roomsCount; i++) {
      let roomName = `Sala ${i}: ${this.title}`;
      const channel = await message.guild.channels
        .create(roomName, {
          type: 'GUILD_VOICE',
          parent: categoryChannelId ?? "846373225767239690",
        })

      this.roomsChannelId.push(channel.id);
    }
  }

  public getTalkType(): string {
    return this.type === EventType.TALK ? 'Palestra' : 'Workshop';
  }

  public toMessageEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setTitle(this.title)
      .addField('Tipo de Evento', this.getTalkType())
      .addField('Data/Horário', formatDate(this.date))
      .addField('Palestrante(s)', this.speakers.join('\n'))
      .setColor(this.type === EventType.TALK ? "GREEN" : "RED");
  }
}

Event.init({
  notionId: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  date: Sequelize.DATE,
  type: Sequelize.SMALLINT,
  code: Sequelize.STRING,
  status: Sequelize.SMALLINT,
  speakers: {
    type: Sequelize.STRING,
    get: function () {
      return JSON.parse(this.getDataValue('speakers'));
    },
    set: function (val) {
      return this.setDataValue('speakers', JSON.stringify(val));
    }
  }
},
  {
    sequelize: db.connection,
    modelName: 'event',
  }
);



