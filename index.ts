import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

import { runStreamTest } from './src/service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => runStreamTest(res));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
