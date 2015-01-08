/*
 * class skeleton
 */
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {
    var initializing = false,
        fnTest = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function () {};

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] === "function" &&
                typeof _super[name] === "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

/**
 * Extend
 * @param y
 * @returns {Array}
 */
Array.prototype.objectExtend = function (y) {
    'use strict';

    for (var key in y)
        if (y.hasOwnProperty(key)) this[key] = y[key];

    return this;
};

/**
 * outerclick function ()
 */
(function ($) {

    var elements = [],

        check = function (e) {
            for (var i = 0, l = elements.length; i < l; i++) {
                var el = elements[i];
                if (el == e.target || $.contains(el, e.target)) continue;
                $.event.trigger('outerclick', e, el);
            }
        },

        self = $.event.special.outerclick = {

            setup: function () {
                var i = elements.length;
                if (!i) $.event.add(document, 'click', check);
                if ($.inArray(this, elements) < 0)
                    elements[i] = this;
            },

            teardown: function () {
                var i = $.inArray(this, elements);
                if (i < 0) return;
                elements.splice(i, 1);
                if (!elements.length)
                    $.event.remove(document, 'click', check);
            }

        };

    $.fn.outerclick = function (fn) {
        return fn === undefined
            ? this.trigger('outerclick')
            : this.length ? this.each(function () {
            $(this).bind('outerclick', fn);
        }) : this;
    };

})(jQuery);