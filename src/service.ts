import bluebird from 'bluebird';
import Piscina from 'piscina';
import { resolve } from 'url';
import { heavyCalculations } from './utils';

export async function runHighLoadedOps() {
  const nIter = 50;
  const maxComplexityLevel = Number(process.env.MAX_COMPLEXITY_LEVEL);

  let response = `
    <p>Iterations count: <strong>${nIter}</strong></p>
    <p>Max complexity level: <strong>${process.env.MAX_COMPLEXITY_LEVEL}</strong></p>
    
    <table cellpadding="10" border="1">
      <thead>
        <tr>
          <th><strong>Complexity level</strong></th>
          <th><strong>Logic type</strong></th>
          <th><strong>AVG iteration time</strong></th>
          <th><strong>SUM iterations time</strong></th>
          <th><strong>TOTAL execution time</strong></th>
        </tr>
      </thead>
      <tbody>
  `;

  await bluebird.each(
    new Array(maxComplexityLevel).fill(null) as any[],
    async (_, i) => {
      console.log(`Complexity level "${i + 1}"`);

      // Single thread

      const stResult = runSingleThread(nIter, i + 1);
      console.log('----------');

      // Multi thread (Piscina)

      const mtResult = await runMultiThreads(nIter, i + 1);
      console.log('---------------------------------------');

      response = `${response}
        <tr style="background-color: ${stResult.took < mtResult.took ? '#86DEB7' : '#DE8585'}">
          <td>${i + 1}</td>
          <td>Single thread</td>
          <td>${stResult.avg.toFixed(3)}</td>
          <td>${stResult.sum.toFixed(3)}</td>
          <td>${stResult.took.toFixed(3)}</td>
        </tr>
        
        <tr style="background-color: ${mtResult.took < stResult.took ? '#86DEB7' : '#DE8585'}">
          <td>${i + 1}</td>
          <td>Multi thread</td>
          <td>${mtResult.avg.toFixed(3)}</td>
          <td>${mtResult.sum.toFixed(3)}</td>
          <td>${mtResult.took.toFixed(3)}</td>
        </tr>
        
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `;
    }
  );

  response = `${response}
      </tbody>
    </table>
  `;

  return response;
}

function runSingleThread(nIter: number, complexityLevel: number) {
  console.log('Start Single thread execution');

  const before = process.hrtime();
  const results = [];

  for (let i = 0; i < nIter; i++) {
    const took = heavyCalculations(complexityLevel);
    console.log(`[${i + 1} of ${nIter}]: ${took}`);
    results.push(took);
  }

  const took = Number(process.hrtime(before).join('.'));
  const stats = getExecutionStats(results);

  console.log(`Single thread execution finished`);
  console.log(`AVG = ${stats.avg}`);
  console.log(`SUM = ${stats.sum}`);
  console.log(`TOTAL = ${took}`);

  return { ...stats, took };
}

async function runMultiThreads(nIter: number, complexityLevel: number) {
  console.log('Start Multi thread execution');

  const before = process.hrtime();
  const pool = new Piscina();
  const options = {
    filename: resolve(__dirname, 'src/worker'),
  };

  const tasks = new Array(nIter)
    .fill(null)
    .map(() => pool.run(complexityLevel, options));

  const results = await Promise.all(tasks);
  const took = Number(process.hrtime(before).join('.'));

  const stats = getExecutionStats(results);

  console.log(`Multi thread execution finished`);
  console.log(`AVG = ${stats.avg}`);
  console.log(`SUM = ${stats.sum}`);
  console.log(`TOTAL = ${took}`);

  return { ...stats, took };
}

function getExecutionStats(results: number[]) {
  const sum = results.reduce((acc, value) => acc + value, 0);

  return {
    sum,
    avg: sum / results.length,
  };
}
