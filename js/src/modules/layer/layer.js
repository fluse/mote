/*
 @author      Holger Schauf
 @title       Layer Elements
 @type        module
 @description generate layer with defined content

 @example     var layer = new mote.Layer(); layer.open();
 @example     mote.run('Layer').open();
 */

mote.register('Layer');

mote.Layer = (function ($, tmpl) {
    return Class.extend({

        /**
         *
         * @param cfg
         * @returns {boolean}
         */
        init: function (cfg) {

            this.cfg    = $.extend({
                name: "lyr",
                    close: {
                    isActive: true,
                        name: 'close-lyr',
                        position: 'top-rgt',
                        classes: null,
                        adjustTo: null
                },
                animate: {
                    show: false,
                        hide: false
                },
                dropArea: 'body',
                    classes: 'lyr-fxd bgt-wht-80 zdx-1 cnr',
                    content: {
                    name: '.content',
                        classes: 'pdg-',
                        adjustTo: null
                },
                onClose: function () {},
                onOpen: function () {},
                trigger: null
            }, cfg);


            this.cfg.id = this.cfg.name + mote.generateUID();

            // generate template
            var status = this.generate();

            // create toggle element
            this.setToggle();

            return status;
        },

        setToggle: function () {

            if (this.cfg.trigger === null) return false;

            this.toggle = mote.run('Toggle', {
                trigger: this.cfg.trigger,
                target: this.elm
            });
        },

        /**
         *
         * @returns {boolean}
         */
        generate: function () {

            if (this.cfg.close.isActive)
                this.cfg.classes += " closable";

            var response = mote.getTemplate(this.cfg.name, this.cfg);

            // check for template success
            if (!response) return false;

            // write template to dropare
            $(this.cfg.dropArea).append(response);

            // get created layer dom
            this.elm = $('#' + this.cfg.id);

            // cache layer content
            this.content = this.elm.find(this.cfg.content.name);

            // check for close binding
            if (this.cfg.close.isActive)
                this.elm.bind('click.' + this.cfg.name, mote.doLater(this.close, this));

            return true;

        },

        /**
         *
         * @param content
         * @returns {boolean}
         */
        setContent: function (content) {

            // include close button
            if (this.cfg.close.isActive) {
                var response = mote.getTemplate(this.cfg.name + 'Close', this.cfg);

                if (!response) return false;

                content = $(content).prepend(response);
            }

            // write content to
            this.elm.find(this.cfg.content.name).html(content);

            this.adjustContent();
            this.setCloseEvents();

            return true;
        },

        /**
         *
         * @returns {boolean}
         */
        adjustContent: function () {
            var adjustToElm = $(this.cfg.content.adjustTo);

            // stop on following behaviors
            if (this.cfg.content.adjust === null && adjustToElm.length === 0) return false;

            this.content.css({
                marginTop: (adjustToElm.offset().top + adjustToElm.outerHeight(true))
            });

            return true;
        },

        /**
         *
         * @returns {boolean}
         */
        setCloseEvents: function () {

            var closeElements = this.elm.find('.' + this.cfg.close.name);

            if (closeElements.length > 0)
                closeElements.off().on("click", mote.doLater(this.close, this, true));

            return closeElements.length > 0;
        },

        open: function () {

            /* check for new content */
            if (arguments.length > 0)
                this.setContent(arguments[0]);


            this.setLevel();

            if (this.cfg.animate.open !== false) {
                //mote.run('Animate', this.elm, )
            }

            this.elm.show();

            this.isActive = true;

            this.onOpen();
        },

        close: function () {
            if (
                arguments.length > 0
                    && (typeof arguments[0] === 'boolean' && arguments[0] === true)
                    || (this.cfg.id === arguments[0].target.id || $(arguments[0].target).hasClass("close"))
            ) {
                this.elm.hide();
                this.isActive = false;

                this.cfg.onClose();
            }
        },

        setLevel: function () {
            var instances = mote.app('Layer'),
                level = 0, i;

            for (i = 0; i < instances.length; i++)
                if (instances[i].isActive) level++;

            this.elm.zIndex(level.length);
        }

    });
})(jQuery, $.templates);