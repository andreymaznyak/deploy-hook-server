const path = require('path');
const exec = require('child_process').exec;
const assert = require('assert');

/**
 *
 * @param handlerOptions {{ executeScriptPath, formatExecuteScript }}
 *                          executeScriptPath Команда которую нужно вызвать при деплое
 *                          formatExecuteScriptFn Хук для форматирования пути выполняемого скрипта
 * @returns {{isDeployStarted, haveUnhandledDeploy, deploy: deploy}}
 * @constructor
 */
function DeployHandler(handlerOptions) {
    if (!handlerOptions.executeScriptPath) {
        throw new assert.AssertionError('execute script path must be defined')
    }
    let isDeployStarted = false;
    const waitNextDeployFunctions = [];

    /**
     * @description Функция стартует деплой, если деплой начат вернет результат этого диплоя, иначе начнет новый
     * @param deployInfo Объект с параметрами деплоя, может содержать любые данные для выполняемого скрипта
     * @returns {Promise}
     */
    function deploy(deployInfo) {
        return new Promise(async (resolve, reject) => {
            if (!isDeployStarted) {
                isDeployStarted = true;
                try {

                    const result = await executeDeployScript(deployInfo);
                    isDeployStarted = false;
                    resolve(result);
                } catch (err) {
                    reject(err);
                } finally {
                    // Ожидающие деплоя промисы
                    if (waitNextDeployFunctions.length > 0) {
                        try {
                            const result = await deploy(deployInfo); // Пытаемся их задеплоить
                            while (waitNextDeployFunctions.length > 0) {
                                waitNextDeployFunctions.pop().resolve(result);
                            }
                        } catch ( err ) {
                            while (waitNextDeployFunctions.length > 0) {// Если зафейлились фейлим их
                                waitNextDeployFunctions.pop().reject( err );
                            }
                        }


                    }
                }
            } else {
                waitNextDeployFunctions.push({resolve, reject});
            }
        });

    }

    /**
     * @link deploy
     * @param deployInfo
     * @returns {Promise}
     */
    function executeDeployScript(deployInfo) {
        return new Promise((resolve, reject) => {
            let executeScriptPath = path.normalize(handlerOptions.executeScriptPath);
            if (handlerOptions.formatExecuteScriptFn instanceof Function) {
                executeScriptPath = handlerOptions.formatExecuteScriptFn(executeScriptPath, deployInfo);
            }
            exec(executeScriptPath, (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return reject(err);
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
