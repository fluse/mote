/*
 * @require    jquery.js
 * @require    log.js
 * @require    inheritance.js
 *
 * @autor      Holger Schauf
 * @className  Engine
 * @brief      controle manage and log all applications
 */
var mote = {

    app: {
        name: "mote",
        version: "0.0.1",
        created: "20.01.2014"
    },

    // storage
    data: {},

    lang: document.documentElement.lang || 'de',

    mode: {
        debug: false,
        intern: false,
        record: false,
        measure: false
    },

    // storage
    applications: {},

    templates: {},

    /**
     *
     * @param name
     * @var o = object
     * @var d = array
     * @var j = number
     * @returns {{app}}
     */
    register: function (name) {

        var d = name.split("."),
            o = this;

        for (var j = (d[0] === 'mote') ? 1 : 0; j < d.length; j++) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }

        return o;
    },

    /**
     * Add one key=value to engine.data
     * grep by engine.get(key);
     * @param k
     * @param v
     * @returns {*}
     */
    prop: function (k, v) {
        if (typeof arguments[1] !== "undefined") {
            this.data[k] = v;
            return true;
        }
        return this.data.hasOwnProperty(k) ? this.data[k] : null;
    },

    /**
     * Execute Applications by appName and write to log
     * @param appName
     * @param settings
     * @returns {*|false}
     */
    run: function (appName) {

        try {

            var app = this.getApp(appName);

            if (typeof app === 'object') return app;

            if (this.mode.measure) mote.measure.start();

            var settings = Array.prototype.slice.call(arguments, 1).sort();

            app = new app(settings);

            this.apps(appName, app);

            if (this.mode.measure) mote.measure.stop(appName);

            logo.add("executed", {
                name: appName,
                settings: settings,
                notice: app
            });

            return app;
        }
        catch (e) {

            logo.add("error", {
                name: "error on running: " + appName,
                error: e
            });

            return false;
        }
    },

    apps: function (appName, app) {

        if (!this.applications.hasOwnProperty(appName))
            this.applications[appName] = [];

        if (typeof app === 'undefined')
            return this.applications[appName];

        this.applications[appName].push(app);
    },

    /**
     * delete instances of app
     * @param appName
     */
    clear: function (appName) {

        var instanceList = this.applications[appName];

        for (var i = 0; i < list.length; i++) {
            instanceList[i] = null;
            delete instanceList[i];
        }
    },

    /**
     *
     * @param f = function
     * @param a = arguments
     * @returns {Function}
     */
    doLater: function (f, a) {
        'use strict';
        var args = Array.prototype.slice.call(arguments, 2).sort();
        return function (e) {
            if (typeof e !== 'undefined')
                args.unshift(e);
            return f.apply(a, args);
        };
    },

    /**
     *
     * @param name
     * @param data
     * @returns {*}
     */
    cache: function (name, data) {

        if (typeof data === 'undefined') {
            return localStorage.getItem(name) !== 'undefined'
                ? JSON.parse(localStorage.getItem(name))
                : false;
        }

        localStorage.setItem(name, JSON.stringify(data));

        return true;

    },

    /**
     *
     * @param appName
     * @returns {app}
     */
    getApp: function (appName) {
        var nameGroups = appName.split('.'),
            app = this;

        for (var i = 0; i < nameGroups.length; i++) {
            app = app[nameGroups[i]];
        }

        return app;
    },

    /*
     * Check all Properties from one object for true
     */
    allPropTrue: function (o) {
        for (var p in o) if (!o[p]) return false;
        return true;
    },

    /**
     *
     * @returns {{width: *, height: *}}
     */
    getWindowSize: function () {

        var asObject = arguments.length > 0 ? true : false;

        var object = {
            width: isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth,
            height: isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight
        };

        var string = object.width + "x" + object.height;

        return asObject ? object : string;
        
    },

    getTemplate: function (tpl, data) {

        if (!this.templates.hasOwnProperty(tpl)) {
            var tmpl = $.templates('#' + tpl);
            if (typeof tmpl === 'undefined') {
                logo.add('error', {
                    name: tpl,
                    error: 'template is not defined'
                });
                return false;
            }
            this.templates[tpl] = $.templates('#' + tpl);
            $.templates('#' + tpl)
        }

        return this.templates[tpl].render(data);
    },

    // generate a unique id
    generateUID: function () {

        return 'xxxxxxx'.replace(/[x]/g, function (c) {
            var r = (Math.random() * 16 | 0),
                v = 16 == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        
    }

};