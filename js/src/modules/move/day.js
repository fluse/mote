/*
 * @require    jquery.js
 * @require    inheritance.js
 *
 * @autor      Holger Schauf
 * @pluginName Move App
 * @brief      statistics from move
 */

mote.Move.Day = (function ($) {
    return Class.extend({

        cfg: {
            stepMeter: 1.312,
            percentage: {}
        },

        init: function (cfg) {
            // set config
            this.cfg = $.extend({}, this.cfg, cfg);
            this.convertStepsToMeters();
            this.setPercantageBetween();
            $.tmpl("daywise", this.cfg).appendTo("#content");
        },

        convertStepsToMeters: function () {
            this.cfg.walk = Math.round(this.cfg.walk / this.cfg.stepMeter);
        },

        setPercantageBetween: function () {

            if (this.cfg.walk > this.cfg.cycle) {
                this.cfg.percentage.walk = 100 - (this.cfg.cycle / this.cfg.walk * 100);
            } else {
                this.cfg.percentage.cycle = 100 - (this.cfg.walk / this.cfg.cycle * 100);
            }
        }

    });
})(jQuery);