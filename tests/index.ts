import { HttpsEventSource } from '../dist/lib/https.event-source';

const server = new HttpsEventSource({ serverOpts: {} });
server.listen(8029);
console.log('server listen 8029');
