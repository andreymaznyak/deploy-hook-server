# Library for create deploy hook server

Server listen port and check headers, if headers correct, server execute custom script

# Architecture

Event source (http, https, http2 and other) -> Event filter ( parse body ) -> Script Executor ( exec bash, send req )

# ROADMAP v2

1. Migrate to typescript
1. Run as http2 server
1. Add auto tests
1. Add store commit data
1. Add documentation
1. Add dockerfile

# Usage

install library `npm i deploy-hook-server`  
start server:

```javascript
const serverLib = require('../lib/server');
const server = serverLib.Server({
  port: 40312,
  accessHeaderName: 'deploy-token',
  accessHeaderValue:
    'meex0c8wdmcpjhjsssrfbeveasarhydnoe9g0bxot8fojk708kaiegbo091oaaybl',
  handlerOptions: {
    executeScriptPath: './tests/test-deploy-script.sh',
    formatExecuteScriptFn: function(currentPath, deployParams) {
      console.log(
        'formatExecuteScriptFn',
        `currentPath:${currentPath}`,
        'deployParams:',
        deployParams
      );
      currentPath += ' ' + deployParams['deployService'];
      currentPath += ' ' + deployParams['deployVersion'];
      return currentPath;
    }
  },
  extractRequestDataFn: function(req, res) {
    return new Promise((resolve, reject) => {
      if (req.headers['content-type'] !== 'application/json') {
        return reject(new Error('Content type must be application/json'));
      }
      let totalData = '';
      req.on('data', function(data) {
        totalData += data;
      });
      req.on('end', function() {
        resolve(JSON.parse(totalData));
      });
    });
  }
});
```
