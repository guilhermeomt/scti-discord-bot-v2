import { RunFunction } from './RunFunction';
import { SubCommand } from './SubCommand';

export interface Command {
  name: string;
  category: string;
  run: RunFunction;
  subcommands: SubCommand[];
}
