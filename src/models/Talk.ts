import { Message } from "discord.js";

export class Talk {
  name: string;
  date: Date;
  roomsCount: number;
  readonly channelIds: number[] = [];

  constructor(name: string, date: Date, roomsCount: number) {
    this.name = name;
    this.date = date;
    this.roomsCount = roomsCount;
  }

  async createChannels(message: Message) {
    for (let i = 1; i <= this.roomsCount; i++) {
      let roomName = `Sala ${i}: ${this.name}`;
      const channel = await message.guild.channels
        .create(roomName, {
          type: 'voice',
          parent: process.env.TALK_CATEGORY_ID,
        })

      this.channelIds.push(parseInt(channel.id));

      await channel.createOverwrite(process.env.PARTICIPANT_ROLE_ID, {
        SPEAK: false,
      });
    }
  }
}
