import { db } from "../services/Database";
import { Collection } from "discord.js";
import { Event } from "./Event";

export class EventManager {
  events = new Collection<string, Event>();

  constructor() {
  }

  addEvent(event: Event) {
    const token = String(this.events.size + 1);
    this.events.set(token, event);
    return token;
  }

  getNextTalk(): Event {
    return this.events.first();
  }

  isPresenceConfirmed(userId: string): boolean {
    db.serialize(() => {
      db.each(`SELECT id FROM users WHERE user_id = ?`, [userId], (err, row) => {
        if (row?.id) {
          return true;
        }
      });
    });

    return false;
  }

  findTalkByRoomsChannelId(id: string): Event {
    return this.events.find((value: Event) => {
      const roomId = value.roomsChannelId.find((roomId: string) => {
        return roomId === id;
      });
      return roomId === id;
    });
  }
}

export const eventManager = new EventManager();