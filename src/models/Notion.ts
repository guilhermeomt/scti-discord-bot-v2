import { notionService } from "../services/NotionService";

type Participant = {
  id: string;
  name: string;
  nickname: string;
  email: string;
}

export class Notion {
  participants: Array<Participant> = [];

  constructor() {
  }

  private getParticipantTemplate(data: Participant) {
    return {
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

  private getPresenceTemplate(data: any) {
    return {
      Codigo: {
        title: [
          {
            text: {
              content: data.tag,
            },
          },
        ],
      },
      Participante: {
        relation: [
          {
            id: data.id,
          },
        ],
      },
      Horario: {
        rich_text: [
          {
            text: {
              content: new Date().toLocaleString(),
            }
          }
        ]
      }
    }
  }

  async subscribe(participantData: Participant) {

    const participant = this.getParticipantTemplate(participantData);

    return await notionService.createPage(process.env.NOTION_DATABASE_ID, participant);
  }

  private async findParticipant(participantId: string) {
    const response = await notionService.queryDatabase(process.env.NOTION_PARTICIPANT_DATABASE_ID);

    const participant = response.results.filter((p: any) => p.properties.Id.rich_text[0].plain_text === participantId);

    // TODO: Deal with participant not found 

    return participant[0];
  }

  async confirmPresence(talkId: string, participantId: string) {
    const participant = await this.findParticipant(participantId);

    const talkResponse: any = await notionService.getPage(talkId);

    const presenceListId = talkResponse.properties.IdListaDePresenca.rich_text[0].plain_text;
    const talkTag = talkResponse.properties.Codigo.rich_text[0].plain_text;

    const presence = this.getPresenceTemplate({ ...participant, tag: talkTag });

    return await notionService.createPage(presenceListId, presence);
  }

  async getEventData(eventId: string) {
    const eventPage = await notionService.getPage(eventId);

    const title = eventPage.properties.Name.title[0].plain_text;
    const type = eventPage.properties.Tipo.select.name === 'Palestra' ? '1' : '0';
    const dateString = eventPage.properties.Data.date.start;
    const date = new Date(dateString);
    const code = eventPage.properties.Codigo.rich_text[0].plain_text;
    const presenceListId = eventPage.properties.IdListaDePresenca.rich_text[0].plain_text;

    let speakers: string[] = eventPage.properties['Palestrante(s)'].relation.map(async (speaker: any) => {
      const speakerPage = await notionService.getPage(speaker.id);
      const speakerName = speakerPage.properties.Nome.title[0].plain_text;
      return speakerName;
    });

    speakers = await Promise.all(speakers);
    const event = {
      notionId: eventId,
      code,
      type,
      title,
      date,
      speakers,
      presenceListId,
    }

    return event;
  }

}

export const notion = new Notion();