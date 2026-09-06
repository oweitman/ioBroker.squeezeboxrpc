'use strict';

const http = require('node:http');
const { expect } = require('chai');
const { LmsJsonRpcClient } = require('../lib/lms/jsonRpcClient');

function startServer(handler) {
    return new Promise((resolve, reject) => {
        const server = http.createServer(handler);
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => resolve(server));
    });
}

function stopServer(server) {
    return new Promise(resolve => server.close(resolve));
}

function readJson(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        request.on('data', chunk => chunks.push(chunk));
        request.on('end', () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
            } catch (error) {
                reject(error);
            }
        });
        request.on('error', reject);
    });
}

async function getError(promise) {
    try {
        await promise;
    } catch (error) {
        return error;
    }
    throw new Error('Expected promise to reject');
}

describe('LMS JSON-RPC client', () => {
    let server;
    let client;

    afterEach(async () => {
        client?.close();
        if (server) await stopServer(server);
        client = undefined;
        server = undefined;
    });

    it('sends slim.request commands and preserves the adapter response contract', async () => {
        /** @type {{ authorization?: string, body: any }} */
        let received = { body: {} };
        server = await startServer(async (request, response) => {
            received = { authorization: request.headers.authorization, body: await readJson(request) };
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ id: received.body.id, result: { _volume: 23 } }));
        });
        const address = server.address();
        client = new LmsJsonRpcClient({
            host: '127.0.0.1',
            port: address.port,
            username: 'user',
            password: 'secret',
        });

        const result = await client.requestAsync('aa:bb:cc:dd:ee:ff', ['mixer', 'volume', '?']);

        expect(received.authorization).to.equal(`Basic ${Buffer.from('user:secret').toString('base64')}`);
        expect(received.body.method).to.equal('slim.request');
        expect(received.body.params).to.deep.equal([
            'aa:bb:cc:dd:ee:ff',
            ['mixer', 'volume', '?'],
        ]);
        expect(result).to.include({ ok: true });
        expect(result.result).to.deep.equal({ _volume: 23 });
        expect(result.params).to.deep.equal(received.body.params);
    });

    it('returns errors through the compatibility callback', async () => {
        server = await startServer((request, response) => {
            request.resume();
            response.statusCode = 500;
            response.end('failed');
        });
        const address = server.address();
        client = new LmsJsonRpcClient({ host: '127.0.0.1', port: address.port });

        const result = await new Promise(resolve => client.request('', ['serverstatus', 0, 10], resolve));

        expect(result.ok).to.equal(false);
        expect(result.message).to.equal('LMS JSON-RPC HTTP status 500');
    });

    it('rejects malformed and LMS error responses', async () => {
        let requestCount = 0;
        server = await startServer((request, response) => {
            request.resume();
            requestCount++;
            response.end(
                requestCount === 1 ? '{not-json' : JSON.stringify({ id: 2, error: { message: 'Bad dispatch' } }),
            );
        });
        const address = server.address();
        client = new LmsJsonRpcClient({ host: '127.0.0.1', port: address.port });

        const invalidJsonError = await getError(client.requestAsync('', ['players', 0, 10]));
        const lmsError = await getError(client.requestAsync('', ['unknown']));

        expect(invalidJsonError.message).to.include('Invalid LMS JSON-RPC response');
        expect(lmsError.message).to.equal('LMS JSON-RPC error: Bad dispatch');
    });
});
