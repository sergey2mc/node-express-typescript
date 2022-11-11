declare module 'mississippi' {
  import Pump from 'pump';
  import Each from 'stream-each';
  import Pipeline from 'pumpify';
  import Duplex from 'duplexify';
  import Through from 'through2';
  import Concat from 'concat-stream';
  import Eos from 'end-of-stream';
  import From from 'from2';
  import To from 'flush-write-stream';
  import Parallel from 'parallel-transform';

  const pipe: Pump;
  const each: Each;
  const pipeline: typeof Pipeline;
  const duplex: Duplex;
  const through: Through;
  const concat: Concat;
  const finished: Eos;
  const from: From;
  const to: To;
  const parallel: Parallel;
}
