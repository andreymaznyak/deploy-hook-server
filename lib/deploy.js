const config = require('config');
const path = require('path');
const exec = require('child_process').exec;
const assert = require('assert');

function DeployHandler( executeScriptPath ) {
    if ( !executeScriptPath ) {
        throw new assert.AssertionError('execute script path must be defined')
    }
    let isDeployStarted = false;
    const waitNextDeployFunctions = [];
    function deploy() {
        return new Promise( async (resolve, reject) => {
            if ( !isDeployStarted ) {
                isDeployStarted = true;
                try {
                    const result = await executeDeployScript();
                    isDeployStarted = false;
                    resolve(result);
                    if ( waitNextDeployFunctions.length > 0 ) {
                        const result = await deploy();
                        while ( waitNextDeployFunctions.length > 0 ) {
                            result.pop()(result);
                        }
                    }
                } catch ( err ) {
                    reject(err);
                }
            } else {
                waitNextDeployFunctions.push(resolve);
            }
        });

    }

    function executeDeployScript() {
        return new Promise( (resolve, reject) => {
            exec(path.normalize(executeScriptPath), (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    reject(err);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                resolve({stderr: stderr, stdout: stdout});
            });
        });
    }
    return {
        get isDeployStarted() {
            return isDeployStarted;
        },
        get haveUnhandledDeploy() {
            return haveUnhandledDeploy;
        },
        deploy: deploy
    }
}

module.exports = {
    DeployHandler: DeployHandler
};
