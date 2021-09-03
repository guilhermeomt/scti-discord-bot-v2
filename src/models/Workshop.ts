import { Message, MessageEmbed } from "discord.js";
import { formatDate } from "../utils/formatDate";
import { Event, NewEventData } from "./Event";

export class Workshop extends Event {
  constructor(eventData: NewEventData) {
    super(eventData);
    this.displayColor = 'RED';
  }

  async createChannels(message: Message) {
    for (let i = 1; i <= this.roomsCount; i++) {
      let roomName = `Sala ${i}: ${this.title}`;
      const channel = await message.guild.channels
        .create(roomName, {
          type: 'GUILD_VOICE',
          parent: process.env.TALK_CATEGORY_ID,
        })

      this.roomsChannelId.push(channel.id);
    }
  }

  toMessageEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setTitle(this.title)
      .addField('Tipo de Evento', 'Workshop')
      .addField('Data/Horário', formatDate(this.date))
      .addField('Instrutor(es)', this.speakers.join('\n'))
      .setColor(this.displayColor);
  }
}