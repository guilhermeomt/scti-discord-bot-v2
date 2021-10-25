import { MessageEmbed } from "discord.js";
import { formatDate } from "../utils/formatDate";
import { Event, NewEventData } from "./Event";

export class Talk extends Event {
  constructor(eventData: NewEventData) {
    super(eventData);
    this.displayColor = 'GREEN';
  }

  toMessageEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setTitle(this.title)
      .addField('Tipo de Evento', 'Palestra')
      .addField('Data/Horário', formatDate(this.date))
      .addField('Palestrante(s)', this.speakers.join('\n'))
      .setColor(this.displayColor);
  }
}