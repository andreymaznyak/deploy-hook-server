# Library for create deploy hook server #
Server listen port and check headers, if headers correct, server execute custom script


# Usage #
install library `npm i deploy-hook-server`  
start server:  
```javascript
const serverLib = require('deploy-hook-server/lib/server');  
const server = serverLib.Server(40312, 'access-header-name', 'access-header-value', './execute/script/path.sh');
```
if need environments read how use [config library](https://www.npmjs.com/package/config)
# Variables #
```json
{
  "port": 40312,
  "access-header-name": "deploy-token",
  "access-header-value": "meex0c8wdmcpjhjsssrfbeveasarhydnoe9g0bxot8fojk708kaiegbo091oaaybl",
  "execute-script-path": "./tests/test-deploy-script.sh"
}
```
