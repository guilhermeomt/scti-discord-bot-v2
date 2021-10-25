import { Guild, Message, MessageEmbed } from "discord.js";
import { formatDate } from "../utils/formatDate";
import { Event, NewEventData } from "./Event";

export class Workshop extends Event {
  constructor(eventData: NewEventData) {
    super(eventData);
    this.displayColor = 'RED';
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