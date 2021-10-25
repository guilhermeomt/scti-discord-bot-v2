import axios, { AxiosInstance } from 'axios';


export class NotionService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL:
        'https://api.notion.com/v1/',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2021-08-16',
        Authorization: 'Bearer ' + process.env.NOTION_AUTH_TOKEN,
      }
    });
  }

  async getDatabase(databaseId: string): Promise<any> {
    return new Promise(resolve => Error('Not implemented'))
  }

  async queryDatabase(databaseId: string, startCursor?: string): Promise<any> {
    return new Promise(resolve => Error('Not implemented'))
  }

  async updateDatabase(databaseId: string, data: object): Promise<any> {
    return new Promise(resolve => Error('Not implemented'))
  }

  async getPage(pageId: string): Promise<any> {
    try {
      const res = await this.api.get(`pages/${pageId}`)
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getBlock(elementId: string): Promise<any> {
    return new Promise(resolve => Error('Not implemented'))
  }

  async createPage(data: object): Promise<any> {
    try {
      const res = await this.api.post('pages/', data)
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async updatePage(pageId: string, data: object): Promise<any> {
    try {
      const res = await this.api.patch(`pages/${pageId}`, data)
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}
