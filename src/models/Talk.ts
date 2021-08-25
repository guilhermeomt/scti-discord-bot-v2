import { Message, MessageEmbed } from "discord.js";
import { formatDate } from "../utils/formatDate";

export class Talk {
  title: string;
  date: Date;
  notionId: string;
  speakers: string[];
  roomsCount: number = 3;
  readonly roomsChannelId: string[] = [];
  readonly displayColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`

  constructor(title: string, date: Date, notionId: string, speakers: string[]) {
    this.title = title;
    this.notionId = notionId;
    this.date = date;
    this.speakers = speakers;
  }

  async createChannels(message: Message) {
    for (let i = 1; i <= this.roomsCount; i++) {
      let roomName = `Sala ${i}: ${this.title}`;
      const channel = await message.guild.channels
        .create(roomName, {
          type: 'voice',
          parent: process.env.TALK_CATEGORY_ID,
        })

      this.roomsChannelId.push(channel.id);

      await channel.createOverwrite(process.env.PARTICIPANT_ROLE_ID, {
        SPEAK: false,
      });
    }
  }

  toEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setTitle(this.title)
      .addField('Data/Horário', formatDate(this.date))
      .addField('Palestrante(s)', this.speakers.join('\n'))
      .setColor(this.displayColor)
  }
}