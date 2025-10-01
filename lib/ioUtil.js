/**
 * class with util function for object, state and log access
 */
class ioUtil {
    /**
     * The constructor for the ioUtil class
     *
     * @param adapter - the iobroker adapter
     * @param islogdebug - flag for debug logging
     * @param islogsilly - flag for verbose logging
     */
    constructor(adapter, islogdebug, islogsilly) {
        this.adapter = adapter;
        this.islogsilly = islogsilly;
        this.islogdebug = islogdebug;
        this.observers = [];
        this.doClose = false;
    }
    /**
     * Asynchronously creates a channel object in the ioBroker system.
     *
     * @param stateTemplate - The template containing the common properties of the channel.
     * @param level1path - The first level path to prepend to the channel name, can be null or empty.
     * @param level2path - The second level path to prepend to the channel name, can be null or empty.
     * @returns A promise that resolves when the channel object is set in the adapter.
     */
    createObjectChannelAsync(stateTemplate, level1path, level2path) {
        this.logdebug(`createObject ${stateTemplate.name}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        const newobj = {
            type: 'channel',
            common: stateTemplate,
            native: {},
        };
        return this.adapter.setObjectAsync(name, newobj);
    }
    /**
     * Asynchronously creates a state object in the ioBroker system.
     *
     * @param stateTemplate - The template containing the common properties of the state.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @returns A promise that resolves when the state object is set in the adapter.
     */
    createObjectAsync(stateTemplate, level1path, level2path) {
        this.logdebug(`createObject ${stateTemplate.name}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        const newobj = {
            type: 'state',
            common: stateTemplate,
            native: {},
        };
        return this.adapter.setObjectAsync(name, newobj);
    }
    /**
     * Creates a state object in the ioBroker system if it does not already exist.
     *
     * @param stateTemplate - The template containing the common properties of the state.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @param callback - Optional callback function, called when the object is created.
     */
    createObjectState(stateTemplate, level1path, level2path, callback) {
        this.logdebug(`createObject ${stateTemplate.name}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.adapter.getObject(name, (err, obj) => {
            const newobj = {
                type: 'state',
                common: stateTemplate,
                native: {},
            };
            if (!obj) {
                callback ? this.adapter.setObject(name, newobj, callback) : this.adapter.setObject(name, newobj);
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    }
    /**
     * Asynchronously deletes an object in the ioBroker system.
     *
     * @param id - The name of the object to delete.
     * @param level1path - The first level path to prepend to the object name, can be null or empty.
     * @param level2path - The second level path to prepend to the object name, can be null or empty.
     * @returns A promise that resolves when the object is deleted.
     */
    deleteObjectAsync(id, level1path, level2path) {
        this.logdebug(`deleteObject ${id}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + id;
        return this.adapter.delObject(name, { recursive: true });
    }
    /**
     * Deletes an object in the ioBroker system.
     *
     * @param id - The name of the object to delete.
     * @param level1path - The first level path to prepend to the object name, can be null or empty.
     * @param level2path - The second level path to prepend to the object name, can be null or empty.
     * @param callback - Optional callback function, called when the object is deleted.
     */
    deleteObject(id, level1path, level2path, callback) {
        this.logdebug(`deleteObject ${id}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + id;
        this.adapter.delObject(name, callback);
    }
    /**
     * Asynchronously sets the state of an object in the ioBroker system.
     *
     * @param name - The name of the state to set.
     * @param value - The value to set the state to.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @returns A promise that resolves when the state is set in the adapter.
     */
    setStateAsync(name, value, level1path, level2path) {
        this.logdebug(`setState ${name}`);
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        return this.adapter.setState(name, value, true); // jshint ignore:line
    }
    /**
     * Sets the state of an object in the ioBroker system, with ack=false.
     *
     * @param name - The name of the state to set.
     * @param value - The value to set the state to.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @param callback - Optional callback function, called when the state is set in the adapter, but without ack.
     */
    setStateNack(name, value, level1path, level2path, callback) {
        this.logdebug(`setState ${name} ${JSON.stringify(value)}`);
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        callback ? this.adapter.setState(name, value, false, callback) : this.adapter.setState(name, value, true);
    }
    /**
     * Gets all objects in the given path.
     *
     * @param path - The path to retrieve objects from.
     * @returns A promise that resolves with an object containing all retrieved objects.
     */
    async getObjects(path) {
        const key = `${this.adapter.namespace}.${path}`;
        return convertObjects(await this.adapter.getObjectListAsync({ startkey: key, endkey: `${key}\u9999` }));
    }

    /**
     * Gets all states matching the given pattern in the given path.
     *
     * @param pattern - The pattern to match the state names with.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @returns A promise that resolves with an object containing all retrieved states.
     */
    async getStates(pattern, level1path, level2path) {
        this.logdebug(`getStates ${pattern} ${level1path || ''} ${level2path || ''}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + pattern;
        return await this.adapter.getStatesAsync(name);
    }
    /**
     * Retrieves the state of an object in the ioBroker system.
     *
     * @param id - The name of the state to retrieve.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @param callback - The callback function to call when the state is retrieved.
     */
    getState(id, level1path = false, level2path = false, callback) {
        this.logdebug(`getState ${id}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + id;
        this.adapter.getState(name, callback);
    }
    /**
     * Creates a state object in the ioBroker system.
     *
     * @param stateTemplate - The template containing the common properties of the state.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @param callback - Optional callback function, called when the state is created.
     */
/*     createState(stateTemplate, level1path = false, level2path = false, callback) {
        this.logdebug(`createState ${stateTemplate.name}`);
        const name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + stateTemplate.name;
        this.logdebug(`Create Key ${name}`);
        this.adapter.createState(level1path, level2path, stateTemplate.name, stateTemplate, callback);
    } */
    /**
     * Sets the state of an object in the ioBroker system.
     *
     * @param name - The name of the state to set.
     * @param value - The value to set the state to.
     * @param level1path - The first level path to prepend to the state name, can be null or empty.
     * @param level2path - The second level path to prepend to the state name, can be null or empty.
     * @param [callback] - Optional callback function, called when the state is set in the adapter.
     */
    setState(name, value, level1path, level2path, callback) {
        this.logdebug(`setState ${name}: ${value}`);
        name = (level1path ? `${level1path}.` : '') + (level2path ? `${level2path}.` : '') + name;
        callback ? this.adapter.setState(name, value, true, callback) : this.adapter.setState(name, value, true); // jshint ignore:line
    }
    /**
     * Sets a timeout for a specified callback function and stores it in the observers object.
     *
     * @param id - Unique identifier for the timeout, used to manage and clear the timeout.
     * @param callback - The function to execute after the specified time delay.
     * @param time - The delay in milliseconds before executing the callback.
     * @param arg1 - Optional first argument to pass to the callback function.
     * @param arg2 - Optional second argument to pass to the callback function.
     */
    setTimeout(id, callback, time, arg1 = null, arg2 = null) {
        this.logsilly(`setTimeout ${id}`);
        if (this.doClose) {
            return;
        }
        this.clearTimeout(id);
        this.observers[id] = setTimeout(callback.bind(this), time, arg1, arg2);
    }
    /**
     * Clears a timeout that was previously set using setTimeout.
     *
     * @param id - Unique identifier for the timeout to clear.
     */
    clearTimeout(id) {
        this.logsilly(`clearTimeout ${id}`);
        if (this.observers[id]) {
            clearTimeout(this.observers[id]);
        }
        delete this.observers[id];
    }
    /**
     * Clears an interval that was previously set using setInterval.
     *
     * @param id - Unique identifier for the interval to clear.
     */
    clearInterval(id) {
        this.logsilly(`clearInterval ${id}`);
        if (this.observers[id]) {
            clearInterval(this.observers[id]);
        }
        delete this.observers[id];
    }
    /**
     * Clears all timeouts and intervals that were previously set using setTimeout and setInterval.
     *
     * This is a convenience method to clear all observers at once.
     */
    deleteObservers() {
        this.logdebug('deleteObservers');
        Object.keys(this.observers).map(i => this.clearTimeout(i));
    }
    /**
     * Closes all active connections by logging the action, deleting observers,
     * and setting the doClose flag to true.
     */
    closeConnections() {
        this.logdebug('closeConnections');
        this.deleteObservers();
        this.doClose = true;
    }
    /**
     * Logs a message at the silly log level if the adapter is configured for it.
     *
     * @param s - The message to log.
     */
    logsilly(s) {
        if (this.islogsilly) {
            this.adapter.log.silly(s);
        }
    }
    /**
     * Logs a message at the debug log level if the adapter is configured for it.
     *
     * @param s - The message to log.
     */
    logdebug(s) {
        if (this.islogdebug) {
            this.adapter.log.debug(s);
        }
    }
    /**
     * Logs a message at the error log level.
     *
     * @param s - The message to log.
     */
    logerror(s) {
        this.adapter.log.error(s);
    }
    /**
     * Logs a message at the info log level.
     *
     * @param s - The message to log.
     */
    loginfo(s) {
        this.adapter.log.info(s);
    }
}
/**
 * Converts an object list returned by getObjects or getObjectListAsync into a normal object with id as key.
 *
 * @param objects - The object list to convert.
 * @returns The converted object.
 */
function convertObjects(objects) {
    return objects.rows.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
    }, {});
}
module.exports = {
    ioUtil,
};
