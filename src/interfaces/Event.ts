import { RunFunction } from './RunFunction';

export interface Event {
  name: string;
  run: RunFunction;
}
