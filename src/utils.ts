export function heavyCalculations(complexityLevel: number): number {
  const start = process.hrtime.bigint();
  let obj = { a: 1 } as any;

  for (let i = 0; i < complexityLevel; i++) {
    obj = { obj1: obj, obj2: obj }; // Doubles in size each iter
  }

  const str = JSON.stringify(obj);
  const res = JSON.parse(str);

  const end = process.hrtime.bigint();
  return convertHrtime(end - start).seconds;
}

export function convertHrtime(hrtime) {
  const nanoseconds = hrtime;
  const number = Number(nanoseconds);
  const milliseconds = number / 1000000;
  const seconds = number / 1000000000;

  return {
    seconds,
    milliseconds,
    nanoseconds
  };
}
