import { Response } from 'express';
import * as miss from 'mississippi';

import { DataSource } from './shared/classes/data-source-stream.readable';
import { DataModifier } from './shared/classes/data-modifyer-stream.transform';
import { DataReceiver } from './shared/classes/data-receiver-stream.writable';

interface Stats {
  from: number;
  to: number;
}

const DATA: Stats[] = [
  { from: 1, to: 2 },
  { from: 3, to: 6 },
  { from: 7, to: 14 },
  { from: 15, to: 30 },
  { from: 31, to: 62 },
  { from: 63, to: 126 },
  { from: 127, to: 254 },
];

export function runStreamTest(res: Response): void {
  const source = new DataSource<Stats>(DATA, true);
  const modifier = new DataModifier<Stats>('to');
  const stringifier = miss.through.obj(
    (chunk: Stats, encoding: string, next: (err?: Error, next?: any) => void) => {
      try {
        const stringified = JSON.stringify(chunk);
        next(null, stringified);
      } catch (e: any) {
        next(e, null);
      }
    }
  );
  // const receiver = new DataReceiver<Stats>(3);

  new miss.pipeline.obj(
    source,
    modifier,
    stringifier,
    // receiver,
    res
  );
}
