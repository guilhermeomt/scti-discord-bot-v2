import { PagesCreateResponse } from "@notionhq/client/build/src/api-endpoints";
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
      Id: {
        title: [
          {
            text: {
              content: String(data.position),
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

    const response: PagesCreateResponse = await notionService.createPage(process.env.NOTION_DATABASE_ID, participant);
    return response;
  }

  async findParticipant(participantId: string) {
    const response = await notionService.queryDatabase(process.env.NOTION_PARTICIPANT_DATABASE_ID);

    const participant = response.results.filter((p: any) => p.properties.Id.rich_text[0].plain_text === participantId);

    // TODO: Deal with participant not found 


    return participant[0];
  }

  //TODO: Refactor this method
  async confirmPresence(talkId: string, participantId: string) {
    const participant = await this.findParticipant(participantId);

    const talkResponse: any = await notionService.getPage(talkId);

    const presenceListId = talkResponse.properties.IdListaDePresenca.rich_text[0].plain_text;

    const presenceListResponse: any = await notionService.queryDatabase(presenceListId);

    //TODO: Deal with presence list not found

    participant.position = presenceListResponse.results.length + 1;

    const presence = this.getPresenceTemplate(participant);

    return await notionService.createPage(presenceListId, presence);
  }


}

export const notion = new Notion();