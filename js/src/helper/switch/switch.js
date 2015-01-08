/*
 @require     jquery.js
 @require     inheritance.js

 @author       Holger Schauf
 @title        Switch Behavior
 @type         helper
 @description  toggle visibility by an element array

 @example      var switcher = new mote.Switch();
 @example      mote.run('Switch');
 */

mote.register("Switch");

mote.Switch = (function ($) {
    return Class.extend({

        init: function (cfg) {

            // set config
            this.cfg = $.extend({
                trigger: null,
                elements: []
            }, cfg);

            this.event();
        },

        event: function () {

            if (this.cfg.trigger !== null)
                this.cfg.trigger.bind('click.switch', mote.doLater(this.toggle, this));
        },

        /**
         *
         * @param e
         * @returns {boolean}
         */
        toggle: function () {

            for (var i = 0; i < this.cfg.elements.length; i++)
                this.cfg.elements[i].toggle();

            return false;
        },

        addElement: function (el) {
            this.cfg.elements.push(el);
        }

    });
})(jQuery);