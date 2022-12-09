#!/usr/bin/node

import http from 'node:http';
import * as fss from 'node:fs';
import {promises as fs} from 'node:fs';
import url from 'node:url';
import pathlib from 'node:path';
import chalk from 'chalk';
import arg, * as Format from '@j-cake/jcake-utils/args';
import {core} from '@j-cake/mkjson';

const MIME = {
    'json': 'application/json',
    'json5': 'application/json+json5',
    'svg': 'image/svg+xml',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'html': 'text/html',
    'js': 'text/javascript',
    'mjs': 'text/javascript+module',
    'css': 'text/css',
    'map': 'application/json'
};

const coerceToPath = function(path) {
    if (path.startsWith('-'))
        console.warn(`Expected Directory. Provided argument '${path}' looks incorrect.`);

    if (!path)
        path = process.cwd();

    path = core.Path.toAbs(path);

    if (fss.existsSync(path) && fss.statSync(path).isDirectory())
        return fss.opendirSync(path);

    else throw `Invalid Directory: ${path}`;
}

/**
 * @type {default: fss.Dir, port: number}
 */
const argv = arg({
    port: {
        long: 'port',
        short: 'p',
        default: 1080,
        format: Format.Int
    }
}, coerceToPath)(process.argv.slice(2));

console.log(`Serving ${chalk.blue(argv.default.path)} on port: ${chalk.blue(argv.port)}`);

const colouredStatus = status => [chalk.grey, chalk.grey, chalk.green, chalk.blue, chalk.red, chalk.yellow][Math.floor(status/100)](`${status}`);

const srv = http.createServer(async function (req, res) {
    const resource = new url.URL(`http://${req.headers['host']}${req.url}`);
    let path = core.Path.toAbs(pathlib.join(argv.default.path, resource.pathname), argv.default.path);

    if (path.endsWith('/'))
        path += 'index.html';

    if (await fs.stat(path).then(res => res.isFile()).catch(() => false))
        await fs.open(path)
            .then(file => file.createReadStream())
            .then(file => file.pipe(res.writeHead(200, {'Content-Type': MIME[path.split('.').pop().toLowerCase()] ?? 'text/plain'})));
    else
        res.writeHead(404, {'Content-Type': 'text/plain'})
            .end(`The file ${resource.pathname} does not exist`);

    const now = new Date();
    console.log(chalk.grey(`${now.getDate()}.${now.getMonth()}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`), chalk.cyan(req.method.toUpperCase()), colouredStatus(res.statusCode), path);

}).listen(argv.port, () => console.log(`Listening on port ${argv.port}`));

process.on('beforeExit', () => argv.default.close());