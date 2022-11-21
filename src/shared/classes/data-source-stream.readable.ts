import { Readable, ReadableOptions } from 'stream';

export class DataSource<T extends object> extends Readable {
  private readonly items: T[];

  /**
   * Creates a readable stream from an array
   * @param data - An array of the input data
   * @param terminate - Should the stream be terminated by sending null when no more items?
   * @param streamOptions - Additional options for the stream
   * @returns {Readable} A readable stream
   */
  constructor(
    data: T[],
    terminate?: boolean,
    streamOptions?: ReadableOptions
  ) {
    const options: ReadableOptions = streamOptions || {};
    options.objectMode = true; // This is an object stream
    super(options);

    this.items = [...data] || [];

    if (terminate) {
      this.items.push(null); // Push null to the end of the array in order to signal that the stream terminates
    }
  }

  /**
   * Reads one object from the array at a time until no more items should be pushed
   * @private
   * @override
   */
  _read() {
    let go = true;
    while (go && this.items.length) {
      go = this.push(this.items.shift());
    }
  }
}
