const { existsSync } = require('node:fs');
const { buildReact, copyFiles, deleteFoldersRecursive, npmInstall } = require('@iobroker/build-tools');

const sourceDirectory = `${__dirname}/src-widgets/`;
const targetDirectory = `${__dirname}/widgets/vis2squeezeboxrpc`;

function clean() {
    deleteFoldersRecursive(`${sourceDirectory}build`);
    deleteFoldersRecursive(targetDirectory);
}

function copyBuild() {
    copyFiles(['src-widgets/build/customWidgets.js'], 'widgets/vis2squeezeboxrpc');
    copyFiles(['src-widgets/build/assets/*.*'], 'widgets/vis2squeezeboxrpc/assets');
}

function waitForBuildOutput(timeoutMs = 300000) {
    const outputFile = `${sourceDirectory}build/customWidgets.js`;
    const started = Date.now();
    return new Promise((resolve, reject) => {
        const check = () => {
            if (existsSync(outputFile)) {
                resolve(undefined);
            } else if (Date.now() - started >= timeoutMs) {
                reject(new Error(`Vite did not create ${outputFile} within ${timeoutMs} ms`));
            } else {
                setTimeout(check, 500);
            }
        };
        check();
    });
}

if (process.argv.includes('--javascript-vite') || process.argv.length === 2) {
    clean();
    const install = existsSync(`${sourceDirectory}node_modules`) ? Promise.resolve() : npmInstall(sourceDirectory);
    install
        .then(() => buildReact(sourceDirectory, { rootDir: __dirname, vite: true }))
        .then(() => waitForBuildOutput())
        .then(() => copyBuild())
        .catch(error => {
            console.error(`Cannot build VIS-2 widgets: ${error}`);
            process.exitCode = 1;
        });
}
