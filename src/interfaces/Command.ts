import { RunFunction } from './RunFunction';

export interface Command {
  name: string;
  category: string;
  run: RunFunction;
}
