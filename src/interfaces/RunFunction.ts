import { Bot } from '../client';

export interface RunFunction {
  (client: Bot, ...args: any[]): Promise<void>;
}
