'use strict';

const helper = require('@iobroker/vis-2-widgets-testing');
const { after, before, describe, it } = require('mocha');
const adapterName = require('../package.json').name.split('.').pop() || 'squeezeboxrpc';

describe(adapterName, () => {
    let browserStarted = false;

    before(async function () {
        this.timeout(360_000);
        await helper.startIoBroker();
        await helper.startBrowser(process.env.CI === 'true');
        browserStarted = true;
        await helper.createProject();
        await helper.palette.openWidgetSet(null, adapterName);
    });

    it('creates every VIS-2 widget', async function () {
        this.timeout(180_000);
        const widgets = await helper.palette.getListOfWidgets(null, adapterName);
        for (const widget of widgets) {
            const widgetId = await helper.palette.addWidget(null, widget);
            await helper.screenshot(null, `10_${widget}`);
            await helper.view.deleteWidget(null, widgetId);
        }
    });

    after(async function () {
        this.timeout(30_000);
        if (browserStarted) {
            await helper.stopBrowser();
        }
        return helper.stopIoBroker();
    });
});
