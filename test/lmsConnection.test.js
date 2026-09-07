'use strict';

const { expect } = require('chai');
const { LmsConnection } = require('../lib/lms/connection');

describe('LMS connection facade', () => {
    it('uses JSON-RPC commands without creating Telnet by default', async () => {
        const calls = [];
        let commandClosed = false;
        const commandClient = {
            request: (...args) => {
                calls.push(args);
                return Promise.resolve({});
            },
            requestAsync: async (...args) => ({ args }),
            close: () => (commandClosed = true),
        };
        let telnetCreated = false;

        const connection = new LmsConnection({
            host: 'lms.local',
            port: 9000,
            clientFactory: () => commandClient,
            telnetClientClass: class {
                constructor() {
                    telnetCreated = true;
                }

                start() {}

                close() {}
            },
        });

        connection.start();
        connection.request('player', ['power', '?'], () => undefined);
        expect(await connection.requestAsync('player', ['mode', '?'])).to.deep.equal({
            args: ['player', ['mode', '?']],
        });
        connection.close();

        expect(calls).to.have.length(1);
        expect(telnetCreated).to.equal(false);
        expect(commandClosed).to.equal(true);
    });

    it('starts and closes optional Telnet notifications', () => {
        let telnetOptions;
        let started = false;
        let closed = false;
        class FakeTelnetClient {
            constructor(options) {
                telnetOptions = options;
            }

            start() {
                started = true;
            }

            close() {
                closed = true;
            }
        }

        const onEvent = () => undefined;
        const connection = new LmsConnection({
            host: 'lms.local',
            port: 9000,
            username: 'user',
            password: 'secret',
            useTelnet: true,
            telnetPort: 9090,
            onEvent,
            clientFactory: () => ({
                request: async () => ({}),
                requestAsync: async () => ({}),
                close: () => undefined,
            }),
            telnetClientClass: FakeTelnetClient,
        });

        connection.start();
        connection.close();

        expect(telnetOptions).to.include({
            host: 'lms.local',
            port: 9090,
            username: 'user',
            password: 'secret',
            onEvent,
        });
        expect(started).to.equal(true);
        expect(closed).to.equal(true);
    });

    it('uses one WebSocket client and suppresses Telnet notifications', () => {
        let commandStarted = false;
        let commandClosed = false;
        let telnetCreated = false;
        const connection = new LmsConnection({
            host: 'lms.local',
            port: 9000,
            connectionType: 'websocket',
            useTelnet: true,
            telnetPort: 9090,
            clientFactory: () => ({
                start: () => (commandStarted = true),
                request: async () => ({}),
                requestAsync: async () => ({}),
                close: () => (commandClosed = true),
            }),
            telnetClientClass: class {
                constructor() {
                    telnetCreated = true;
                }

                start() {}

                close() {}
            },
        });

        connection.start();
        connection.close();

        expect(commandStarted).to.equal(true);
        expect(commandClosed).to.equal(true);
        expect(telnetCreated).to.equal(false);
    });
});
