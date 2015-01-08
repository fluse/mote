/*
 @require     jquery.js
 @require     inheritance.js

 @author       Holger Schauf
 @title        Animation
 @type         module animation
 @description  animate css from animation.css

 @example:     var animate = new mote.animate(); animate.now();
 @example:     mote.run('animate').now();
 @options:     queue, cfg
 @options:     elm, duration, animation, loop, callback
 */

mote.register("Animate");

mote.Animate = (function ($) {
    return Class.extend({

        classes: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',

        current: null,
        running: false,

        /**
         *
         * @param queue
         * @param cfg
         * @returns {boolean}
         */
        init: function (cfg, queue) {

            try {

                this.cfg = $.extend({
                    elm: null,
                    duration: 0,
                    animation: 'fade',
                    loop: 0,
                    callback: null
                }, cfg);

                this.queue = (typeof queue !== 'undefined') ? queue : null;

                console.dir(this.cfg);

                return true;

            } catch (e) {

                logo.add('error', {
                    name: 'Animate Init Error',
                    error: e
                });

                return false;
            }
        },

        /**
         *
         * @returns {boolean}
         */
        now: function () {

            if (this.running) return false;

            this.step = 0;

            this.start();

            return true;

        },

        /**
         *
         * @returns {boolean}
         */
        start: function () {

            this.current = (this.queue !== null) ? this.queue[this.step] : this.cfg;

            this.buildProperties();

            /* Add Ani End Listing */
            this.current.elm.addClass(this.getClasses())
                .one(this.classes, mote.doLater(this.cycle, this));

            return true;
        },

        /**
         *
         * @returns {*}
         */
        cycle: function () {

            this.current.elm.removeClass(this.getClasses());

            if (this.current.hasOwnProperty('callback'))
                this.current.callback(this.step);

            this.step++;

            this.running = this.queue !== null && this.step < this.queue.length
                ? this.start()
                : false;

            delete this;
        },

        /**
         *
         * @returns {string}
         */
        getClasses: function () {
            return 'animate-' + this.current.duration + ' ' + this.current.animation;
        },

        /**
         *
         * @returns {boolean}
         */
        buildProperties: function () {

            if (this.elmNotExist()) return false;

            var options = this.cfg;

            for (var key in this.current)
                if (this.current.hasOwnProperty(key))
                    options[key] = this.current[key];

            this.current = options;

            console.dir(this.current);
            return true;
        },

        /**
         *
         * @returns {boolean}
         */
        elmNotExist: function () {
            return this.current.elm.length;
        }

    });
})(jQuery);