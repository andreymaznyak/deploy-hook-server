const http = require('http');
const deploy = require('./deploy');


module.exports = {
    Server: Server
};

/**
 *
 * @param serverOptions {{
 *  port,
 *  accessHeaderName,
 *  accessHeaderValue,
 *  extractRequestDataFn req res Promise,
 *  handlerOptions: {
 *     executeScriptPath,
 *     formatExecuteScriptFn,
 *  },
 * }}
 * @returns {*}
 * @constructor
 */
function Server(
    serverOptions
) {
    console.log(serverOptions);
    if ( !serverOptions ) {
        throw new Error('options must be defined');
    }
    const deployHandler = new deploy.DeployHandler(serverOptions.handlerOptions);
    const server = http.createServer( async (req, res) => {
        const deployToken = req.headers[serverOptions.accessHeaderName];
        if ( deployToken === serverOptions.accessHeaderValue ) {
            res.write('ok');
            const deployData = {};
            if ( serverOptions.extractRequestDataFn instanceof Function ) {
                const extractedDeployData = await serverOptions.extractRequestDataFn(req, res);
                Object.assign(deployData, extractedDeployData);
            }
            await deployHandler.deploy(deployData);

        } else {
            res.write('error');
        }
        res.end();
    });
    console.log('listen requests on ' + serverOptions.port + ' port');
    server.listen(serverOptions.port);
    return server;
}