export function heavyCalculations(complexityLevel: number): number {
  const before = process.hrtime();
  let obj = { a: 1 } as any;

  for (let i = 0; i < complexityLevel; i++) {
    obj = { obj1: obj, obj2: obj }; // Doubles in size each iter
  }

  const str = JSON.stringify(obj);
  const res = JSON.parse(str);
  return Number(process.hrtime(before).join('.'));
}
