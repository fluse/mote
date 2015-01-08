/*
 @require     jquery.js
 @require     inheritance.js

 @author       Holger Schauf
 @title        Toggle Behavior
 @type         helper
 @description  set sticky behavior events on target and trigger

 @example      var sticky = new mote.Toggle(); dropdown.show();
 @example      mote.run('Toggle').show();
 */

mote.register('Toggle');

mote.Toggle = (function ($) {
    return Class.extend({

        visible: false,
        pinned: false,

        init: function (cfg) {

            console.log("test");

            // set config
            this.cfg = $.extend({
                active: 'active',
                target: null,
                trigger: null,
                hovered: false,
                pinned: true,
                onShow: function () {}
            }, cfg);

            this.events();

        },

        events: function () {


            console.log("test");

            if (this.cfg.hovered) {
                this.cfg.trigger.bind('mouseenter.toggle', mote.doLater(this.show, this));
                this.cfg.trigger.parent().bind('mouseleave.toggle', mote.doLater(this.hide, this));
            }

            if (this.cfg.pinned) {
                this.cfg.trigger.bind('click.toggle', mote.doLater(this.toggle, this));
                this.cfg.target.bind('click.toggle', mote.doLater(this.setPinned, this));
            }
        },

        /**
         *
         * @param e
         * @returns {boolean}
         */
        toggle: function (e) {
            e.preventDefault();

            if (this.cfg.hovered) {
                if (this.cfg.pinned)
                    setTimeout(mote.doLater(this.setOuterEvent, this), 1);

                this.pinned = !this.pinned;
                return false;
            }

            this.visible ? this.hide() : this.showToggle();

            return false;
        },

        /**
         *
         * @returns {boolean}
         */
        show: function () {

            this.cfg.target.show();

            this.cfg.trigger.addClass(this.cfg.active);

            this.visible = true;

            this.cfg.onShow();

            return this.visible;
        },

        /**
         *
         * @returns {boolean}
         */
        showToggle: function () {

            if (this.cfg.pinned)
                setTimeout(mote.doLater(this.setOuterEvent, this), 1);

            this.pinned = true;
            return this.show();
        },

        /**
         *
         * @returns {boolean}
         */
        setOuterEvent: function () {
            this.cfg.target
                .unbind('outerclick')
                .bind('outerclick', mote.doLater(this.checkHide, this));

            return true;
        },

        /**
         *
         * @returns {boolean}
         */
        hide: function () {

            if (this.pinned && this.cfg.hovered) return false;

            this.cfg.target.hide();

            this.cfg.trigger.removeClass(this.cfg.active);

            if (this.cfg.pinned)
                this.cfg.target.unbind('outerclick');

            this.visible = false;
            this.pinned = false;

            return this.visible;
        },

        /**
         *
         * @param e
         * @returns {boolean}
         */
        checkHide: function () {
            this.pinned = false;

            return this.hide();
        },

        /**
         *
         * @returns {boolean}
         */
        setPinned: function () {
            this.setOuterEvent();
            this.pinned = true;
            return this.pinned;
        },

        /**
         * remove events
         */
        remove: function () {
            this.cfg.trigger.unbind('click.toggle');
            return this.hide();
        }

    });
})(jQuery);