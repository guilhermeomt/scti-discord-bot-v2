import { Client } from "@notionhq/client";
import { InputPropertyValueMap } from "@notionhq/client/build/src/api-endpoints";
import { notionApi as api } from "./Api";


export class NotionService {
  client: Client = new Client({
    auth: process.env.NOTION_AUTH_TOKEN,
  });

  constructor() {
  }

  getDatabase(databaseId: string): Promise<any> {
    return this.client.databases.retrieve({
      database_id: databaseId
    });
  }

  queryDatabase(databaseId: string, startCursor?: string): Promise<any> {
    return this.client.databases.query({
      database_id: databaseId,
      start_cursor: startCursor ? startCursor : undefined,
    });
  }

  updateDatabase(databaseId: string, data: object): Promise<any> {
    return api.patch(`/database/${databaseId}`, data);
  }

  getPage(pageId: string): Promise<any> {
    return this.client.pages.retrieve({
      page_id: pageId
    });
  }

  getBlock(elementId: string): Promise<any> {
    return this.client.blocks.children.list({
      block_id: elementId,
    });
  }

  createPage(parentId: string, data: object, content?: object): Promise<any> {
    return this.client.pages.create({
      parent: {
        database_id: parentId,
      },
      properties: {
        ...data,
      },
      children: [
        ...content as any
      ]
    })
  }

  updatePage(pageId: string, data: InputPropertyValueMap): Promise<any> {

    return this.client.pages.update({
      page_id: pageId,
      properties: {
        ...data,
      },
      archived: false,
    })
  }
}

export const notionService = new NotionService();