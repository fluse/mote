/*
 * @require    jquery.js
 * @require    inheritance.js
 *
 * @autor      Holger Schauf
 * @pluginName Move App
 * @brief      statistics from move
 */

mote.register("move");

mote.Move = (function ($) {
    return Class.extend({

        list: [],

        cfg: {
            data: {
                name: "data",
                link: '/',
                type: 'json'
            }
        },

        init: function (cfg) {

            // set config
            this.cfg = $.extend({}, this.cfg, cfg);
            this.getData();
        },

        getData: function () {
            $.ajax({
                url: "move.json",
                dataType: "json",
                success: mote.doLater(this.build, this)
            });
        },

        build: function (data) {

            $("#moveDaywise").template("daywise");

            for (var day in data.history) {
                this.list.push(
                    mote.run('Move.Day', data.history[day])
                );
            }

        }

    });
})(jQuery);

mote.Move.prototype.app = {
    autor: "Holger Schauf",
    name: "Move",
    version: "0.0.1"
};