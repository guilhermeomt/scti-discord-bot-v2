import { ColorResolvable, Message, MessageEmbed } from "discord.js";

export enum EventStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}

export type NewEventData = {
  title: string;
  type: string;
  date: Date;
  code: string;
  notionId: string;
  speakers: string[];
  presenceListId: string;
}

export abstract class Event {
  title: string;
  date: Date;
  notionId: string;
  code: string;
  presenceListNotionId: string;
  speakers: string[];
  status: EventStatus = EventStatus.PENDING;
  roomsCount: number = 3;
  protected displayColor: ColorResolvable;
  readonly roomsChannelId: string[] = [];


  constructor({ title, date, code, notionId, presenceListId, speakers }: NewEventData) {
    this.title = title;
    this.date = date;
    this.code = code;
    this.notionId = notionId;
    this.presenceListNotionId = presenceListId;
    this.speakers = speakers;
  }

  abstract createChannels(message: Message): Promise<void>;
  abstract toMessageEmbed(): MessageEmbed;
}
