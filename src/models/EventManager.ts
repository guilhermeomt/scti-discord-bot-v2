import { Event } from "./Event";

export class EventManager {
  private ongoingEvents: Array<Event>;

  constructor() {
    this.ongoingEvents = new Array();
  }

  addEvent(event: Event): void {
    this.ongoingEvents.push(event);
  }

  findEventByRoomsChannelId(id: string): Event {
    return this.ongoingEvents.find((value: Event) => {
      const roomId = value.roomsChannelId.find((roomId: string) => {
        return roomId === id;
      });
      return roomId === id;
    });
  }
}

export const eventManager = new EventManager();