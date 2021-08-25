import { Talk } from "./Talk";
import { db } from "../services/Database";
import { Collection } from "discord.js";

export class TalkManager {
  talks = new Collection<string, Talk>();

  constructor() {
  }

  addTalk(talk: Talk) {
    const token = String(this.talks.size + 1);
    this.talks.set(token, talk);
    return token;
  }

  getNextTalk(): Talk {
    return this.talks.first();
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

  findTalkByRoomsChannelId(id: string): Talk {
    return this.talks.find((value: Talk) => {
      const roomId = value.roomsChannelId.find((roomId: string) => {
        return roomId === id;
      });
      return roomId === id;
    });
  }
}

export const talkManager = new TalkManager();