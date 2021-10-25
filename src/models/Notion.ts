import { NotionService } from "../services/NotionService";
import { NewEventData } from "./Event";
import { Participant } from "./Participant";

type ParticipantData = Pick<Participant, 'name' | 'nickname' | 'id' | 'email'>;

export class Notion {
  private notionService = new NotionService();

  constructor() {
  }

  private getParticipantTemplate(data: ParticipantData) {
    return {
      parent: {
        database_id: "a0b2d182b9aa4e2faa16bfc6b001da39",
      },
      properties: {
        Nome: {
          title: [
            {
              text: {
                content: data.name,
              },
            },
          ],
        },
        Email: {
          rich_text: [
            {
              text: {
                content: data.email,
              },
            },
          ],
        },
        Id: {
          rich_text: [
            {
              text: {
                content: data.id,
              },
            },
          ],
        },
        'Nickname do Discord': {
          rich_text: [
            {
              text: {
                content: data.nickname,
              },
            },
          ],
        },
      }
    }
  }

  private getPresenceTemplate(talkIds: string[], currentTalkId: string) {
    return {
      properties: {
        'Presença': {
          relation: [
            ...talkIds.map(talkId => ({ id: talkId })),
            {
              id: currentTalkId,
            }
          ]
        }
      }
    }
  }

  public async subscribe(participantData: ParticipantData): Promise<string> {
    const participantTemplate = this.getParticipantTemplate(participantData);

    try {
      const notionPage = await this.notionService.createPage(participantTemplate);

      return notionPage.id;
    } catch (error) {
      console.log(error)
    }
  }


  public async confirmPresence(talkId: string, participantId: string) {
    // const participant = eventManager.getParticipant(participantId);

    // const previousTalksIds = participant.presences.map(presence => presence.talkId);

    // const presenceTemplate = this.getPresenceTemplate(previousTalksIds, talkId);

    // this.notionService.updatePage(participant.notionId, presenceTemplate)

    // participant.addPresence(talkId, new Date());

    // const talkResponse: any = await this.notionService.getPage(talkId);

    // const presenceListId = talkResponse.properties.IdListaDePresenca.rich_text[0].plain_text;
    // const talkTag = talkResponse.properties.Codigo.rich_text[0].plain_text;

    // const presence = this.getPresenceTemplate({ ...participant, tag: talkTag });

    // return await this.notionService.createPage(presenceListId);
  }

  public async getEventData(eventId: string): Promise<NewEventData> {
    const eventPage = await this.notionService.getPage(eventId);

    const title = eventPage.properties.Name.title[0].plain_text;
    const type = eventPage.properties.Tipo.select.name === 'Palestra' ? 0 : 1;
    const dateString = eventPage.properties.Data.date.start;
    const date = new Date(dateString);
    const code = eventPage.properties.Codigo.rich_text[0].plain_text;
    const speakersName: string = eventPage.properties['Palestrante(s)'].rich_text[0].plain_text
    const speakers: string[] = speakersName.split('\n');

    const eventData: NewEventData = {
      notionId: eventId,
      code,
      type,
      title,
      date,
      speakers,
    }

    return eventData;
  }

}

export const notion = new Notion();