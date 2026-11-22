const path = require('node:path');
const { hostname } = require('node:os');
const { once } = require('node:events');
const { expect } = require('chai');
const { tests } = require('@iobroker/testing');

tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        suite('Adapter lifecycle', getHarness => {
            let harness;

            before(() => {
                harness = getHarness();
            });

            it('handles messages and stops cleanly', async function () {
                this.timeout(30_000);
                await harness.enableSendTo();
                await harness.startAdapterAndWait();

                const players = await new Promise(resolve => {
                    harness.sendTo('squeezeboxrpc.0', 'getPlayerNames', {}, resolve);
                });
                expect(players).to.deep.equal([]);

                // The harness uses system.host.testing, but js-controller only accepts stop signals from its host.
                const stopped = once(harness.adapterProcess, 'exit');
                await harness.states.setState('system.adapter.squeezeboxrpc.0.sigKill', {
                    val: -1,
                    from: `system.host.${process.env.IOB_HOSTNAME || hostname()}`,
                });
                await stopped;
                expect(harness.didAdapterStop()).to.equal(true);
                expect(harness.adapterExit).to.be.a('number');
            });
        });
    },
});
