import axios, { AxiosInstance } from 'axios';

export class Api {
  private readonly baseUrl: string;
  api: AxiosInstance;

  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      }
    });
  }

  get(url: string): Promise<any> {
    return this.api.get(url);
  }

  post(url: string): Promise<any> {
    return this.api.post(url);
  }

  patch(url: string, data: object): Promise<any> {
    return this.api.patch(url, { data });
  }
}

export const notionApi = new Api('https://api.notion.so/v1/', process.env.NOTION_AUTH_TOKEN);