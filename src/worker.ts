import { heavyCalculations } from './utils';

module.exports = async (complexityLevel: number) => {
  console.log(`Worker runs with "${complexityLevel}" param`);
  return heavyCalculations(complexityLevel);
};
