const http = require('http');
const config = require('config');
const deploy = require('./deploy');


module.exports = {
    Server: Server
};

function Server(
    port = config.get('port'),
    accessHeaderName = config.get('access-header-name'),
    accessHeaderValue = config.get('access-header-value'),
    executeScriptPath = config.get('execute-script-path')
) {
    const deployHandler = new deploy.DeployHandler(executeScriptPath);
    const server = http.createServer( (req, res) => {
        const deployToken = req.headers[accessHeaderName];
        if ( deployToken === accessHeaderValue ) {
            res.write('ok');
            deployHandler.deploy();

        } else {
            res.write('error');
        }
        res.end();
    });
    console.log('listen requests on ' + port + ' port');
    server.listen(port);
    return server;
}