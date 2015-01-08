/*
 * @require    jquery.js
 * @require    inheritance.js
 *
 * @autor      Holger Schauf
 * @pluginName pointMenu App
 * @brief      set template to position of trigger elements point
 */

mote.register("PointMenu");

mote.PointMenu = (function ($, tmpl) {
    return Class.extend({

        pointPosition: null,

        cache: null,

        cfg: {
            host:        'local',
            data:        {},
            triggerArea: null,
            position:    'center',
            callback:    null,
            tmplName:    null,
            close:       true,
            preload:     true
        },

        init: function (cfg) {

            // set config
            this.cfg = $.extend(this.cfg, cfg);
            
            this.cfg.data.uid = mote.generateUID();

            // set trigger event
            this.setEvent();

            // template from cache or
            return this.cfg.preload ? this.getTemplate() : true;
        },

        /**
         *
         * @returns {boolean}
         */
        getTemplate: function () {

            if (this.cache !== null) {
                $('body').append(this.cache);
                return true;
            }

            // check 
            if (this.cfg.host !== 'local') {
                $.ajax({
                    url: this.cfg.host,
                    success: mote.doLater(this.buildTemplate, this)
                });
                return true;
            } else {
                return this.buildTemplate();
            }
        
        },

        /**
         *
         * @returns {boolean}
         */
        buildTemplate: function () {

            if ($('#' + this.cfg.tmplName).length > 0) {

                this.cache = $(tmpl(this.cfg.tmplName));
                $('body').append(this.cache);

                if (this.cfg.close === true) {

                    this.cache.append(tmpl('close'));

                    if (this.cfg.close === true) {
                        $(this.cache).find('.close').click(mote.doLater(this.hide, this));
                    }
                }

                return true;
            }

            return false;
        },

        setPosition: function () {

            // get calculated positions
            var position = this.getPosition();
            position.right = null;
            position.bottom = null;
            position.position = 'absolute';
            // correct position on window collision

            var collision = mote.WindowCollision.check(position);

            delete position.width;
            delete position.height;

            position = $.extend(position, collision.correction);
            this.cache.css(position);

        },

        /**
         *
         * @returns {object}
         */
        getPosition: function () {

            this.cache = $(this.cache);

            var position = this.positions(this.cfg.position);

            position.width = Math.abs(this.cache.outerWidth(true));
            position.height = Math.abs(this.cache.outerHeight(true));

            return position;

        },

        /**
         *
         * @param p = position
         * @returns {object}
         */
         positions: function (p) {

            // @todo insert current scroll top
            var top = this.pointPosition.clientY;
            var left = this.pointPosition.clientX;
            var width = this.cache.outerWidth(true);
            var height = this.cache.outerHeight(true);
            var scroll = window.pageYOffset;
            
            var set = {
                top: function (t, l, w, h, s) {
                    return {
                        top: t - h + s
                    };
                },
            
                bottom: function (t, l, w, h, s) {
                    return {
                        top: t + w + s
                    };
                },

                center : function (t, l, w, h, s) {
                    return {
                        top: t - (h / 2) + s,
                        left: l - (w / 2)
                    };
                }
            };

            return set[p](top, left, width, height, scroll);
        },

        setEvent: function () {
            this.cfg.triggerArea.click(mote.doLater(this.show, this));
        },

        /*
         * arguments[e] = event
         */
        show: function () {

            this.pointPosition = arguments[0];
            this.setPosition();
            this.cache.show();
            
            if (this.cfg.callback !== null) {
                this.cfg.callback();
                this.cfg.callback = null;
            }
        },

        hide: function () {
            this.cache.hide();
        }

    });
})(jQuery, mote.template);

mote.PointMenu.prototype.app = {
    autor: "Holger Schauf",
    name: "PointMenu",
    version: "0.0.3"
};