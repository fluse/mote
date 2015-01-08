/*
 * @require    jquery.js
 *
 * @autor      Holger Schauf
 * @name       logo log objects
 * @className  logo
 * @brief      write all activities for statistics and development as object inside log
 */

var logo = {

    app: {
        name: "logo",
        version: "0.0.1"
    },

    cfg: {
        maxLogLength: 50
    },

    // storage
    logs: {
        error: [],
        executed: [],
        events: [],
        loaded: [],
        warning: []
    },

    env: navigator,

    add: function (logName, entities) {

        // exit on live or quality mode
        if (!mote.mode.record) return false;

        if (!this.logs.hasOwnProperty(logName))
            this.logs[logName] = [];

        // save log
        this.logs[logName].unshift($.extend(entities, {
            type: logName,
            date: new Date()
        }));

        this.cut(logName);

        if (!mote.mode.intern) return false;

            try {
                console.info(entities);
            } catch(e) {

            }
        return true;
    },

    clear: function (logName) {

        if (typeof this.logs[logName] !== "undefined") {
            this.logs[logName] = [];
            return true;
        }
        return false;
    },

    clearAll: function () {
        for (var l in this.logs) this.clear(l);
        try {
            console.clear();
        } catch(e) {

        }
        return true;
    },

    cut: function (logName) {

        if (this.logs[logName].length > this.cfg.maxLogLength) {
            this.export();
            this.logs[logName].pop();
        }

    },

    // grep a log
    get: function (logName) {
        return this.logs[logName];
    },

    //@todo send to munin
    export: function () {

    }
};