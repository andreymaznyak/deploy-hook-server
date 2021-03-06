const serverLib = require('../lib/server');
const server = serverLib.Server({
    port: 40312,
    accessHeaderName: 'deploy-token',
    accessHeaderValue: 'meex0c8wdmcpjhjsssrfbeveasarhydnoe9g0bxot8fojk708kaiegbo091oaaybl',
    handlerOptions: {
        executeScriptPath: './tests/test-deploy-script.sh',
        formatExecuteScriptFn: function (currentPath, deployParams) {
            console.log('formatExecuteScriptFn', `currentPath:${currentPath}`, 'deployParams:', deployParams);
            currentPath += ' ' + deployParams['deployService'];
            currentPath += ' ' + deployParams['deployVersion'];
            return currentPath;
        },
    },
    extractRequestDataFn: function (req, res) {
        return new Promise( (resolve, reject) => {
            if ( req.headers['content-type'] !== 'application/json' ) {
                return reject(new Error('Content type must be application/json'));
            }
            let totalData = '';
            req.on('data', function (data) {
                totalData+= data;
            });
            req.on('end', function () {
                resolve( JSON.parse(totalData) );
            });
        });
    }
});