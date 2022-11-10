import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

import { runHighLoadedOps } from './src/service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', async (req: Request, res: Response) => {
  res.send(await runHighLoadedOps());
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
