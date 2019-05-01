'use strict';

/*
 * Created with @iobroker/create-adapter v1.12.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

const SqueezeServer = require('squeezenode-pssc');
const IoSbServer = require(__dirname +'/iosbserver');

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

var squeezeboxServer;

/**
 * Starts the adapter instance
 * @param {Partial<ioBroker.AdapterOptions>} [options]
 */
function startAdapter(options) {
    // Create the adapter and define its methods
    return adapter = utils.adapter(Object.assign({}, options, {
        name: 'squeezeboxrpc',

        // The ready callback is called when databases are connected and adapter received configuration.
        // start here!
        ready: main, // Main method defined below for readability

        // is called when adapter shuts down - callback has to be called under any circumstances!
        unload: (callback) => {
            try {
                squeezeboxServer.doDiscoverServerClose();
                adapter.log.info("squeezeboxrpc unloaded");
                callback();
            } catch (e) {
                callback();
            }
        },

        // is called if a subscribed state changes
        stateChange: (id, state) => {
            if (state) {
                // The state was changed
                if (squeezeboxServer) squeezeboxServer.stateChange(id,state);
            } else {
            }
        },

    }));
}

function main() {

    if (!squeezeboxServer) {
        squeezeboxServer = new IoSbServer(adapter);
        adapter.subscribeStates('*');
        adapter.setState('info.connection', false, true);
    }
}

if (module.parent) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
}

