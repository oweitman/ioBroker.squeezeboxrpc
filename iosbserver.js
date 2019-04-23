"use strict";

//node --inspect-brk=192.168.1.23:9229 node_modules/iobroker.squeezeboxrpc/squeezeboxrpc.js --force --logs

const utils = require('@iobroker/adapter-core');
const dgram = require('dgram');
const SqueezeServer = require('squeezenode-pssc');
const ioSBPlayer = require(__dirname +'/iosbplayer');

function IoSbServer(adapter) {
    
   
    let that = this;
    this.sbServerStatus = {
	"lastscan": {
        name:   "LastScan",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"version": {
        name:   "Version",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"uuid": {
        name:   "uuid",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"name": {
        name:   "Name",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"mac": {
        name:   "mac",
        read:   true,
        write:  false,
        type:   "string",
        role:   "info.mac",
        exist:  false 
    },
	"info total albums": {
        name:   "TotalAlbums",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"info total artists": {
        name:   "TotalArtists",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"info total genres": {
        name:   "TotalGenres",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"info total songs": {
        name:   "TotalSongs",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"info total duration": {
        name:   "TotalDuration",
        read:   true,
        write:  false,
        type:   "number",
        role:   "media.duration",
        exist:  false 
    },
	"player count": {
        name:   "PlayerCount",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"sn player count": {
        name:   "PlayerCountSN",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
	"other player count": {
        name:   "PlayerCountOther",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    },
    "otherServers": {
        name:   "otherServers",
        read:   true,
        write:  true,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"getFavorites": {
        name:   "getFavorites",
        read:   true,
        write:  true,
        type:   "boolean",
        role:   "button",
        def: false,
        exist:  false 
    }};
    this.sbFavoritesState = {
	"name": {
        name:   "Name",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"type": {
        name:   "type",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"id": {
        name:   "id",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"hasitems": {
        name:   "hasitems",
        read:   true,
        write:  false,
        type:   "string",
        role:   "value",
        exist:  false 
    },
	"url": {
        name:   "url",
        read:   true,
        write:  false,
        type:   "number",
        role:   "media.url",
        exist:  false 
    },
	"image": {
        name:   "image",
        read:   true,
        write:  false,
        type:   "string",
        role:   "url.icon",
        exist:  false 
    },
	"isaudio": {
        name:   "isaudio",
        read:   true,
        write:  false,
        type:   "number",
        role:   "value",
        exist:  false 
    }};
    
    this.ServerStatePath = "Server";
    this.FavoritesStatePath = "Favorites";
    this.PlayersStatePath = "Players";
    
    this.currentStates = {};
    this.players = [];
    this.observers = [];
    
    this.adapter = adapter;

    this.adapter.setState('info.connection', false, true);
    this.adapter.subscribeStates('*');

    this.sbServer = new SqueezeServer('http://'+adapter.config.server, Number.parseInt(adapter.config.port));

    this.log = {};
    this.logsilly = false;
    this.logdebug = true;
    this.errmax = 5;
    this.errcnt = -1;
    this.connected=0;
    this.firstStart = true;
    
    this.init = function() {
        this.setState('connection', true, "info");
        this.getDiscoverServers();
        this.doObserverServer();
        this.doObserverFavorites();
    }
    this.doObserverServer = function() {
        this.log.silly("doObserverServer");
        this.getServerstatus();
        this.setTimeout('serverstatus',this.doObserverServer.bind(this),30*1000)
    }
    this.setTimeout = function(id,callback,time) {
        this.clearTimeout(id);
        this.observers[id]= setTimeout(callback.bind(this),time);
    }
    this.setInterval = function(id,callback,time) {
        this.clearInterval(id);
        this.observers[id]= setInterval(callback.bind(this),time);
    }
    this.clearInterval = function(id) {
        if (this.observers[id]) clearInterval(this.observers[id]);
        delete this.observers[id];
    }
    this.clearTimeout = function(id) {
        if (this.observers[id]) clearTimeout(this.observers[id]);
        delete this.observers[id];
    }
    this.doObserverFavorites = function() {
        this.log.silly("doObserverFavorites");
        this.getFavorites();
        this.setTimeout('favorites',this.doObserverFavorites.bind(this),12*60*60*1000)
    }
    this.getDiscoverServers = function() {
        this.log.silly("getDiscoverServers");
        var socket = dgram.createSocket('udp4');
        const msg = Buffer.from('eIPAD\0NAME\0JSON\0UUID\0VERS');
        var broadcastAddress = '255.255.255.255';
        var broadcastPort = 3483;
        socket.bind(broadcastPort, '0.0.0.0', function() {
            socket.setBroadcast(true);
        });
        socket.on("message", function ( data, rinfo ) {
            this.log.silly("getDiscoverServers: Message resceived");
            if (data.toString().charAt()=="E") {
                var msg = data.toString();
                msg = msg.substr(1);
                var srv = {};
                var len = msg.length;
                var tag,len2,val;
                while (len>0) {
                    tag = msg.substr(0,4);
                    len2 = msg.charCodeAt(4);
                    val = msg.substr(5,len2);
                    msg = msg.substr(len2+5);
                    len=len-len2-5;
                    srv[tag] = val;
                }
                srv['ADDRESS'] = rinfo.address;
                srv['TIMESTAMP'] = Date.now();
                var state = {}; 
                Object.assign(state,this.sbServerStatus['otherServers']);
                state.name = srv['ADDRESS'].replace(/\./g,"-");
                state.def = JSON.stringify(srv);
                this.createState(state,this.ServerStatePath,this.sbServerStatus['otherServers'].name,function(a,b,c) {
                    this.setState(srv['ADDRESS'].replace(/\./g,"-"), JSON.stringify(srv),this.ServerStatePath, this.sbServerStatus['otherServers'].name,false);
                }.bind(this));
                this.log.debug("Autodiscover: Server found " + srv['NAME'] + " IP: " + srv['ADDRESS'] + " Port " + srv['JSON'] + " UUID " + srv['UUID']);
            }
        }.bind(this));

        setInterval(function () {
            this.getStates('*', this.ServerStatePath,this.sbServerStatus['otherServers'].name, function (err, states) {
                for (var id in states) {
                    var srv = JSON.parse(states[id].val);
                    if ( ((Date.now()-srv.TIMESTAMP)/1000)> 60) {
                        this.delObject(id);
                        this.log.debug("Autodiscover: Server removed " + srv['NAME'] + " IP: " + srv['ADDRESS'] + " Port " + srv['JSON'] + " UUID " + srv['UUID']);
                    }
                }
            }.bind(this));
            socket.send(new Buffer(msg), 
                    0, 
                    msg.length, 
                    broadcastPort, 
                    broadcastAddress, 
                    function (err) {
                        if (err) this.log.error(err);
                    }
            );
        }.bind(this), 30*1000);        
    }
    
    this.getServerstatus = function() {
        this.log.silly("getServerstatus");
        this.request("",["serverstatus", "0", "888"], this.doServerstatus.bind(this));        
    }
    this.doServerstatus = function(result){
        this.log.silly("doServerstatus");
        this.checkServerstatusStates(result);
        for (var key in this.sbServerStatus){
            if (result.result.hasOwnProperty(key)) {
                this.setState(this.sbServerStatus[key].name,result.result[key],this.ServerStatePath);
            }
        }
        this.checkNewPlayer(result.result.players_loop);
        this.checkPlayer(result.result.players_loop);
    }
    this.getFavorites = function() {
        this.log.silly("getFavorites");
        this.request("",["favorites", "items", "0", "888","want_url:1"], this.doFavorites1.bind(this));        
    }
    this.doFavorites1 = function(result){
        this.log.silly("doFavorites1");
        var favorites = result.result.loop_loop;
        this.checkFavoriteStates(favorites);
    }
    this.doFavorites2 = function(favorites){
        this.log.silly("doFavorites2");
        for (var favkey in favorites) {
            var favorite = favorites[favkey];
            for (var key in this.sbFavoritesState){
                if (favorite.hasOwnProperty(key)) {
                    this.setState(this.sbFavoritesState[key].name,favorite[key],this.FavoritesStatePath,favkey,false);
                }
            }
        }
    }
    this.checkFavoriteStates = function(favorites) {
        this.log.silly("checkFavoriteStates");
        this.adapter.deleteDevice(this.FavoritesStatePath, function(err,res) {
            for (var favkey in favorites) {
                var favorite = favorites[favkey];
                for (var key in this.sbFavoritesState){
                    if (favorite.hasOwnProperty(key)) {
                        var stateTemplate = this.sbFavoritesState[key];
                        this.createState(stateTemplate,this.FavoritesStatePath,favkey);
                    }
                }
            }
            this.doFavorites2(favorites);
        }.bind(this));
    }
    this.checkServerstatusStates = function(result) {
        this.log.silly("checkServerstatusStates");
        for (var key in this.sbServerStatus){
            if (result.result.hasOwnProperty(key)) {
                var stateTemplate = this.sbServerStatus[key];
                if (!this.currentStates[stateTemplate.name]) {
                    if (!stateTemplate.exist) {
                        this.sbServerStatus[key]=this.createState(stateTemplate,this.ServerStatePath);
                    }
                }
            }
        }
        key = "getFavorites";
        var stateTemplate = this.sbServerStatus[key];
        if (!stateTemplate.exist) {
            this.sbServerStatus[key]=this.createState(stateTemplate,this.ServerStatePath);
        }
    }
    this.checkNewPlayer = function(playersdata) {
        for (var key in playersdata) {
            if (!this.players.hasOwnProperty(playersdata[key].playerid)) {
                this.players[playersdata[key].playerid] = new ioSBPlayer(this,playersdata[key]);
            } 
        }
    }
    this.checkPlayer = function(playersdata) {
        for (var key in playersdata) {
            if (this.players[playersdata[key].playerid].connected != playersdata[key].connected) {
                if (playersdata[key].connected == 0) {
                    this.players[playersdata[key].playerid].disconnect();
                }
                if (playersdata[key].connected == 1) {
                    this.players[playersdata[key].playerid].connect();
                }
            }
        }
    }
    this.stateChange = function(id,state) {
        // Warning, state can be null if it was deleted
        if (!id || !state || state.ack ) {
            return;
        }
        var idParts = id.split('.');
        idParts.shift();
        idParts.shift();
        if (idParts[0] == this.ServerStatePath )    this.doServerStateChange(idParts,state);
        if (idParts[0] == this.FavoritesStatePath ) this.doFavoritesStateChange(idParts,state);
        if (idParts[0] == this.PlayersStatePath )   this.doPlayersStateChange(idParts,state);
    }
    this.doServerStateChange = function(idParts,state) {
        idParts.shift();
        if (idParts[0] == "getFavorites") {
            if (state.val == true) this.getFavorites();
        }
    }
    this.doFavoritesStateChange = function(idParts,state) {
    }
    this.doPlayersStateChange = function(idParts,state) {
        idParts.shift();
        var player = this.findPlayerByName(idParts[0]);
        if (player) player.doServerStateChange(idParts,state);
    }
    this.findPlayerByName = function(name) {
        for (var key in this.players) {
            if (this.players[key].playername == name) return this.players[key] ;
        }
    }    
    this.createState = function(stateTemplate,level1path=false,level2path=false,callback) {
        var name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + stateTemplate.name;
        this.log.silly("Create Key " + name);
        this.adapter.createState(level1path,level2path,stateTemplate.name,stateTemplate,callback);
        stateTemplate.exist = true;
        return stateTemplate;
    }
    this.request = function(playerid, params, callback) {
        this.sbServer.request(playerid, params, function(callback,result) {
            if (result.ok) {
                this.connected=1;
                this.errcnt = -1;
                this.firstStart = false;
                if (callback) callback(result);
            } else {
                if (this.firstStart) this.disconnect();
                if (this.errcnt == -1 ) this.errcnt = this.errmax;
                this.errcnt--;
                if (this.errcnt == 0) {
                    this.errcnt = -1;
                    this.disconnect();
                }
            }
        }.bind(this,callback));
    }
    this.disconnect = function() {
        this.log.debug("Server disconnect");
        this.firstStart = false;
        this.connected=0;
        this.clearTimeout('serverstatus');
        this.clearTimeout('favorites');
        if (this.connected == 0 && this.observers['checkserver']) return;
        this.setState('connection', false, "info");
        for (var key in this.players) {
            this.players[key].disconnect();
        }
        this.setInterval('checkserver',this.doCheckServer.bind(this),10*1000);
    }
    this.connect = function() {
        this.log.debug("Server connect");
        this.clearInterval('checkserver');
        this.setState('connection', true, "info");
        this.connected=1;
        this.init();
    }
    this.doCheckServer = function() {
        this.log.silly("doCheckServer");
        this.request("",["serverstatus", "0", "888"], function(result) {
            if (result.ok) {
                this.connect();
            }
        }.bind(this));                
    }
    this.setState = function(name, value,level1path=false,level2path=false,check=true,callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        if (name=="Players.SqueezeKitchen.Name")             this.log.debug("setState name: " + name + " value: " + value);
        if (this.currentStates[name] !== value && check) {
            this.currentStates[name] = value;
            this.log.silly("setState name: " + name + " value: " + value);
            this.adapter.setState(name, value, true, callback);
        } else {
            this.currentStates[name] = value;
            this.log.silly("setState name: " + name + " value: " + value);
            this.adapter.setState(name, value, true, callback);            
        }
    }
    this.getState = function(name, level1path=false,level2path=false,callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        this.adapter.getState(name, callback);            
    }
    this.delObject = function(name, level1path=false,level2path=false,callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        this.adapter.delObject(name, callback);            
    }
    this.getStates = function(pattern, level1path=false,level2path=false,callback) {
        var name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + pattern;
        this.adapter.getStates(name, callback);            
    }
    this.test = function() {
    }
//    this.test();
    this.log.silly = function(s) {
        if (this.logsilly) this.adapter.log.silly(s);
    }.bind(this);
    this.log.debug = function(s) {
        if (this.logdebug) this.adapter.log.debug(s);
    }.bind(this);
    this.sbServer.on('register', this.init.bind(this));
}
module.exports = IoSbServer;
