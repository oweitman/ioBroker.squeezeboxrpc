'use strict';

// https://github.com/elParaguayo/LMS-CLI-Documentation/blob/master/LMS-CLI.md

/*
 * Created with @iobroker/create-adapter v1.11.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const SqueezeServer = require('squeezenode-pssc');

// Load your modules here, e.g.:
// const fs = require("fs");
const IoSbServer = require(__dirname +'/iosbserver');

// create the adapter object
var adapter = utils.Adapter('squeezeboxrpc');

var squeezeboxServer;
var devices = {}; // mapping of MAC to device object (which has a reference to the player for that device)
var currentStates = {}; // mapping of state name to state value (so we don't set the same value multiple times)

// Squeezebox Server HTTP TCP port (web interface)
var httpPort;

// unloading
adapter.on('unload', function (callback) {
    adapter.log.info("squeezeboxrpc unloaded");
    callback();
});

// startup
adapter.on('ready', function () {
    adapter.log.info("squeezeboxrpc loaded");
    main();
});
adapter.on('stateChange', function (id, state) {
    if (squeezeboxServer) squeezeboxServer.stateChange(id,state);
});

function main() {
    if (!squeezeboxServer) squeezeboxServer = new IoSbServer(adapter);
/*    
    if (adapter.config.server == '0.0.0.0') {
        adapter.log.warn('Can\'n start adapter for invalid server address: ' + adapter.config.server);
        return;
    }

    adapter.setState('info.connection', false, true);
    adapter.subscribeStates('*');
    
    squeezeboxServer = new SqueezeServer('http://192.168.1.20', 9000);
    
    squeezeboxServer.on('register', function(){
    //you're ready to use the api, eg.
    squeezeboxServer.getPlayers( function(reply) {
            adapter.log.debug(JSON.stringify(reply));
            adapter.log.info('creating/updating player channels');
            reply.result.forEach(function(player) {
                adapter.log.debug(JSON.stringify(player));

                adapter.log.info("Found player " + player.playerid);
                var device = {
                    mac: player.playerid,
                    name: null,
                    channelName: null,
                    player: player.name,
                    duration: 0,
                    elapsed: 0,
                    searchingArtwork: true,
                    isSleep: false,
                    intervalReqTimerSleep: null
                };
                devices[device.mac] = device;



                });

    });
});

*/    
    
    adapter.subscribeStates('*');
    adapter.setState('info.connection', false, true);
}






