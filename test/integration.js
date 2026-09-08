const path = require('node:path');
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

                await harness.stopAdapter();
                expect(harness.didAdapterStop()).to.equal(true);
            });
        });
    },
});
