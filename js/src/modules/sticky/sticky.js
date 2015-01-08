/*
 @author      Holger Schauf
 @title       Sticky Elements
 @type        core module
 @description set Element Sticky if it will go out of view

 Example:
 $(".storno").sticky();
 */

var stj = (typeof stj !== 'undefined') ? stj : {};

stj.sticky = (function ($) {
    return Class.extend({

        elmTop: null,

        cfg: {
            active: "stick",
            topPadding: 0,
            heightCheckElement: "#stickyPanel .fxd-730"
        },

        /**
         *
         * @param elm
         * @param cfg
         * @returns {boolean}
         */
        init: function (elm, cfg) {
            this.cfg = $.extend({}, this.cfg, cfg);
            this.elm = $(elm);

            this.setChecks();

            this.setHeight();

            return this.check();
        },

        /**
         *
         * @returns {boolean}
         */
        check: function () {

            this.setTop();

            if (this.elm.hasClass("disabled") === true) return false;

            return this.isOutOfView()
                 ? this.setSticky()
                 : this.clearSticky();
        },

        /**
         *
         * @returns {boolean}
         */
        setSticky: function () {
            this.elm.addClass(this.cfg.active).css("top", this.cfg.topPadding);
            return true;
        },

        /**
         *
         * @returns {boolean}
         */
        clearSticky: function () {
            this.elm.removeClass(this.cfg.active);
            return true;
        },

        setHeight: function () {
            $(this.elm).parent().css('height', $(this.cfg.heightCheckElement).outerHeight(true));
        },

        /**
         *
         * @returns {null|number}
         */
        setTop: function () {
            if (!this.elm.hasClass(this.cfg.active) && this.elm.is(":visible")) {
                this.elmTop = Math.ceil(this.elm.offset().top);
                return this.elmTop;
            }
            return null;
        },

        /**
         *
         * @returns {boolean}
         */
        isOutOfView: function () {
            return $(window).scrollTop() > this.elmTop;
        }

    });
})(jQuery);

stj.sticky.prototype.setChecks = function () {

    // bind check event to element
    this.elm.bind("check", $.proxy(this.check, this));

    // bind check event to element
    this.elm.bind("setHeight", $.proxy(this.setHeight, this));

    // bind scroll check event to element
    $(window).scroll($.shove(this.check, this));
};

/*
 * Object Storage
 */
stj.sticky.storage = [];

(function ($) {
    $.fn.sticky = function (cfg) {
        return this.each(function () {
            stj.sticky.storage.push(new stj.sticky($(this), cfg));
        });
    };
})(jQuery);