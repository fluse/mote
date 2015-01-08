/*
 @require     jquery.js
 @require     inheritance.js

 @author       Holger Schauf
 @title        Dice
 @type         module
 @description  generate random number

 @example      var dice = new mote.Dice(); dice.roll();
 @example      mote.run('Dice').roll();
 */

mote.register("Dice");

mote.Dice = (function ($) {
    return Class.extend({

        disabled: false,

        history: [],

        init: function (cfg) {
            this.cfg = $.extend({
                min: 1,
                max: 6,
                destroy: false
            }, this.cfg, cfg);
        },

        /**
         *
         * @returns {number|boolean}
         */
        roll: function () {

            if (this.disabled)
                return false;

            var number = Math.floor(
                Math.random() * this.cfg.max
            ) + this.cfg.min;

            this.history.push(number);

            if (this.cfg.destroy) delete this;

            return number;
        },

        /**
         *
         * @param round
         * @returns {number}
         */
        getFromHistory: function (round) {
            return this.history.length < round ?
                this.last() : this.history[round];
        },

        /**
         *
         * @returns {number}
         */
        last: function () {
            return this.history[this.history.length - 1];
        },

        /**
         *
         * @returns {boolean}
         */
        getYesNo: function () {
            return Math.round(Math.random()) ? true : false;
        },

        /**
         *
         * @returns {boolean}
         */
        disable: function () {
            this.disabled = true;
            return this.disabled;
        },

        /**
         *
         * @returns {boolean}
         */
        activate: function () {
            this.disabled = false;
            return this.disabled;
        },

        /**
         *
         * @param multiplicator
         * @returns {number}
         */
        bonus: function (multiplicator) {
            var number = (this.getLast() * multiplicator);
            this.history.push(number);
            return number;
        },

        /**
         *
         * @param number
         * @returns {number}
         */
        add: function (number) {
            var last = this.getLast();
            last = (last + number);
            this.history[this.history.length - 1] = last;

            return last;
        },

        setMax: function (number) {
            this.cfg.max = number;
        }

    });
})(jQuery);

/**
 *
 * @param number
 * @returns {number}
 */
mote.Dice.prototype.roundUp = function (number) {
    return (Math.round(number * 10) / 10).toFixed(0);
};

/**
 *
 * @param number
 * @returns {number}
 */
mote.Dice.prototype.roundDow = function (number) {
    return Math.floor(number).toFixed(0);
};