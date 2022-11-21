import { Writable, WritableOptions } from 'stream';

export class DataReceiver<T extends object> extends Writable {
  private buffer: T[];
  private readonly bufferSize: number;

  /**
   * Creates a writable stream
   * @param bufferSize - Size of the stream's internal buffer
   * @param streamOptions - Additional options for the stream
   * @returns {Writable} A writable stream
   */
  constructor(
    bufferSize: number,
    streamOptions?: WritableOptions
  ) {
    const options: WritableOptions = streamOptions || {};
    options.objectMode = true;
    super(options);

    this.buffer = [];
    this.bufferSize = bufferSize;
  }

  /**
   *
   * @param chunk - Input data
   * @param encoding - Buffer encoding
   * @param next - Callback function
   * @private
   * @override
   */
  _write(chunk: T, encoding: string, next: (error?: (Error | null)) => void): void {
    // add item to buffer
    this.buffer.push(chunk);

    // if buffer reached the target length, return
    if (this.buffer.length === this.bufferSize) {
      return this.insert(next);
    }

    return next();
  }

  /**
   *
   * @param callback - Callback function
   * @private
   * @override
   */
  _final(callback: (error?: (Error | null)) => void): void {
    if (this.buffer.length) {
      this.insert(callback);
    }

    console.log('Writing completed!');

    callback(null);
  }

  private insert(next: (error?: (Error | null)) => void) {
    console.log('Insert data to somewhere', this.buffer);
    this.buffer = [];
    next();
  }
}
