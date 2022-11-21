import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

import { runHighLoadedOps, runStreamTest } from './src/service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => res.send(`
  <p>
    <span><strong>GET /stream</strong> - run stream test</span>
  </p>
  <p>
    <span><strong>GET /worker-threads</strong> - run worker-threads tests</span>
  </p>
`));

app.get('/stream', (req: Request, res: Response) => runStreamTest(res));
app.get('/worker-threads', async (req: Request, res: Response) => {
  res.send(await runHighLoadedOps());
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
