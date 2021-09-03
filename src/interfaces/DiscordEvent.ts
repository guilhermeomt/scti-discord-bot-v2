import { RunFunction } from './RunFunction';

export interface DiscordEvent {
  name: string;
  run: RunFunction;
}
