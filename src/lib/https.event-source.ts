import { IncomingMessage, ServerResponse } from 'http';
import { createServer, Server, ServerOptions } from 'https';
import { Readable, ReadableOptions, Writable } from 'stream';

import { EventSourceInterface } from './event-source';

export class HttpsEventSource implements EventSourceInterface {
  server: Server;
  readable: Readable;
  private writeble: Writable;
  constructor(opts: {
    streamOpts?: ReadableOptions;
    serverOpts: ServerOptions;
  }) {
    this.readable = new Readable({
      objectMode: true,
      highWaterMark: 4,
      ...opts.streamOpts
    });
    this.writeble = new Writable();
    this.writeble.on('data', data => {
      this.readable.push(JSON.parse(data));
    });
    this.readable.pause(); // pause becouse https server is not started
    this.server = createServer(
      opts.serverOpts,
      (req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'POST') {
          req.pipe(this.writeble);
        }
      }
    );
  }

  listen(port: number) {
    this.readable.resume();
    this.server.listen(port);
  }

  close(callback?: Function) {
    this.server.close(callback);
    this.readable.destroy();
    this.writeble.destroy();
  }
}
