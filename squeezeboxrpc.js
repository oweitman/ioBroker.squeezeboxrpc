'use strict';

/*
 * Created with @iobroker/create-adapter v2.6.3
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
let squeezeboxServer;

const IoSbServerRequire = require(`${__dirname}/lib/iosbserver`);

class Squeezeboxrpc extends utils.Adapter {
    /**
     * @param [options] - object with options
     */
    constructor(options) {
        super({
            ...options,
            name: 'squeezeboxrpc',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.on('message', this.onMessage.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here

        // Reset the connection indicator during startup
        this.setState('info.connection', false, true);

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        this.subscribeStates('*');
        // Initialize your adapter here
        if (!squeezeboxServer) {
            this.log.debug('main onReady open squeezeboxrpc');
            squeezeboxServer = new IoSbServerRequire(this);
            this.subscribeStates('*');
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback - call back function
     */
    onUnload(callback) {
        try {
            squeezeboxServer.closeConnections();
            callback();
        } catch {
            callback();
        }
    }
    onMessage(obj) {
        if (typeof obj === 'object' && obj.message) {
            squeezeboxServer.processMessages(obj);
        }
    }
    /**
     * Is called if a subscribed state changes
     *
     * @param id - state id
     * @param state - new state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            if (squeezeboxServer) {
                squeezeboxServer.stateChange(id, state);
            }
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param [options] - object with options
     */
    module.exports = options => new Squeezeboxrpc(options);
} else {
    // otherwise start the instance directly
    new Squeezeboxrpc();
}
