/**
 * @title  validateConnector
 * @author Holger Schauf
 * @type   connector
 * @desc   connect elements handler with validators
 * @date   06.2013
 */

mote.register("validate.create");

mote.validate.create = (function ($) {
    return Class.extend({

        elm: null,
        rules: {},
        msg: {},
        storage: false,

        elmString: null,
        container: null,
        filled: false,
        preventOutput: false,
        status: true,
        valid: false,
        type: null,
        skipValidation: false,

        init: function (data) {

            this.elm     = $(data.elm);
            this.rules   = data.rules;
            this.msg     = data.msg;
            this.storage = data.storage;

            this.elmString = data.elm.split(", ");

            this.elm.change(mote.doLater(this.changeCheck, this));

            this.container = this.elm.parent();

            this.preValididation();

            this.initHtml();

            this.checkSkipFilled();

            // fix for desktop local storage use
            if (false === mobile) {
                for (var item in window.localStorage) {
                    if (/^personal\./.test(item)) {
                        localStorage.removeItem(item);
                    }
                }

            }

        },

        initHtml: function () {
            var okVisibility = this.status ? "block" : "none";

            var html = '';
            for (var key in this.rules) {
                html += '<p class="error-message error-message-' + key + '" style="display:none">' + js_tr['error'][this.msg[key]] + '</p>';
            }

            if (this.container.find('.icon-ok').length === 0)
                html += '<i class="icon-ok" style="display:' + okVisibility + '"></i>';

            this.container.append(html);
        },

        checkSkipFilled: function () {
            if (this.elm.length === 1 && $(this.elm).attr("type") === "checkbox") {
                this.skipValidation = true;
            }
        },

        preValididation: function () {
            this.preventOutput = true;
            this.validate();
            this.preventOutput = false;
        },

        check: function (forceValidate) {

            if (typeof forceValidate === "undefined") forceValidate = false;

            var filled = true;

            this.elm.each(function () {

                if ($(this).val().length === 0) filled = false;

            });

            this.filled = filled;

            if (forceValidate || this.skipValidation || this.filled || this.valid) {
                this.validate();
            }

        },

        validate: function () {

            var checkStatus = true;
            var self = this;

            this.status = true;

            this.elm.each(function () {

                for (var rule in self.rules) {

                    checkStatus = rule !== "type"
                        ? validators[rule](self.rules[rule], $(this))
                        : validators[self.rules[rule]]($(this), self);

                    if (checkStatus === false && $(this).is(":visible")) {
                        self.status = false;
                        self.showMessage(self.msg[rule], rule);
                        continue;
                    }
                }
            });

            if (this.status === true) {

                for (var rule in this.rules) this.removeMessage(rule);

                this.filled = true;
                this.valid = true;

                this.showOk();
            } else {
                this.valid = false;
            }
        },

        showMessage: function (msg, rule) {
            if (this.preventOutput === true) return false;

            this.container.removeClass(function (elm, css) {
                return (css.match(/error-(\w+)/g) || []).join(' ');
            });

            this.container.addClass("error error-" + rule);

            this.container.find('.icon-ok').hide();
        },

        removeMessage: function (rule) {
            this.container.removeClass("error error-" + rule);
        },

        showOk: function () {
            if (this.preventOutput === true) return false;

            this.container.find('.icon-ok').show();
        }

    });
})(jQuery);

mote.validate.prototype.changeCheck = function () {

    this.check();

    if (mobile && $.isLocalStorageSupported() && this.storage) {
        this.setLocalStorage(this.elm, this.elmString, this.storage);
    }

};

mote.validate.prototype.setLocalStorage = function (elm, elmString, storage) {

    if (elm.length === 0) return;

    if (elmString instanceof Array && storage !== undefined && storage.enabled) {
        var elmsLength = elmString.length;
        for (var i = 0; i < elmsLength; i++) {
            var item;
            if (storage.type === "checkbox" || storage.type === "radio") {
                if ($(elmString[i]).attr('checked') === "checked") {
                    item = "checked";
                    localStorage.setItem('personal.' + $(elmString[i]).attr("id"), item);
                } else {
                    localStorage.removeItem('personal.' + $(elmString[i]).attr("id"));
                }
            } else {
                item = $(elmString[i]).val();
                localStorage.setItem('personal.' + $(elmString[i]).attr("id"), item);
            }
        }
    }
};