import { Transform, TransformOptions } from 'stream';
import { TransformCallback } from 'through2';

export class DataModifier<T extends object> extends Transform {
  private readonly key: keyof T;

  /**
   * Creates a transform stream to modify data
   * @param key - Field name to modify
   * @param streamOptions - Additional options for the stream
   * @returns {Transform} A transform stream
   */
  constructor(
    key: keyof T,
    streamOptions?: TransformOptions
  ) {
    const options = streamOptions || {};
    options.readableObjectMode = true; // objects must be read by this stream
    options.writableObjectMode = true; // objects must be written by this stream
    super(options);

    this.key = key;
  }

  /**
   *
   * @param chunk - Input data
   * @param encoding - Buffer encoding
   * @param next - Callback function
   * @private
   * @override
   */
  _transform(chunk: T, encoding: string, next: TransformCallback): void {
    if (chunk && chunk[this.key]) {
      chunk[this.key] = chunk[this.key] as number * 2 as T[keyof T];
      return next(null, chunk);
    }

    return next(
      new Error(
        `"${String(this.key)}" key is missing in the chunk`
      )
    );
  }

  /**
   *
   * @param callback - Callback function
   * @private
   * @override
   */
  _flush(callback: TransformCallback): void {
    console.log('Transformation completed!');
    callback(null);
  }
}
