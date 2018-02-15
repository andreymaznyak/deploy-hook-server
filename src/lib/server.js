const deploy = require('./deploy');

// export interface ServerOptionsInterface {
//   port: number;
//   accessHeaderName: string;
//   accessHeaderValue: string;
//   dataExtracterFn: (req: IncomingMessage, res: ServerResponse) => Promise<any>;
// }

// module.exports = {
//   Server: Server
// };

// /**
//  *
//  * @param serverOptions {{
//  *  port,
//  *  accessHeaderName,
//  *  accessHeaderValue,
//  *  extractRequestDataFn req res Promise,
//  *  handlerOptions: {
//  *     executeScriptPath,
//  *     formatExecuteScriptFn,
//  *  },
//  * }}
//  * @returns {*}
//  * @constructor
//  */
// function Server(serverOptions) {
//   console.log(serverOptions);
//   if (!serverOptions) {
//     throw new Error('options must be defined');
//   }
//   const deployHandler = new deploy.DeployHandler(serverOptions.handlerOptions);
//   const server = createSecureServer(
//     {} as SecureServerOptions,
//     async (req: Http2ServerRequest, res: Http2ServerResponse) => {
//       const deployToken = req.headers[serverOptions.accessHeaderName];
//       if (deployToken === serverOptions.accessHeaderValue) {
//         const deployData = {};
//         if (serverOptions.dataExtracterFn instanceof Function) {
//           const extractedDeployData = await serverOptions.dataExtracterFn(
//             req,
//             res
//           );
//           Object.assign(deployData, extractedDeployData);
//         }
//         const result = await deployHandler.deploy(deployData);
//         res.write(JSON.stringify(result, null, 4));
//       } else {
//         res.write('error');
//       }
//       res.end();
//     }
//   );
//   console.log('listen requests on ' + serverOptions.port + ' port');
//   server.listen(serverOptions.port);
//   return server;
// }
