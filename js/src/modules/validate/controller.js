/**
 * @title  validateController
 * @author Holger Schauf
 * @type   controller
 * @desc   set validators
 * @date   06.2013
 */

mote.register("validate");

mote.validate = (function ($) {
    return Class.extend({

        form: null,
        validateList: [],
        status: true,
        preventSubmitCheck: "back",
        submitTrigger: null,

        init: function (form, cfg, data) {
            var settings = {
                checkOnSubmit: true
            };
            this.cfg = $.extend(settings, cfg);

            this.form = form;
            this.data = data.validations;

            this.generateValidation();
            this.bindEvent();

            this.getLocalStorage();
        },

        getLocalStorage: function () {
            if (mobile && $.isLocalStorageSupported()) {

                for (var validate in this.data) {
                    var elms = this.data[validate].elms[0].split(", ");
                    if (elms instanceof Array && this.data[validate].storage !== undefined && this.data[validate].storage.enabled) {
                        var elmsLength = elms.length;
                        for (var i = 0; i < elmsLength; i++) {
                            var local = localStorage.getItem('personal.' + $(elms[i]).attr("id"));
                            if (local !== null) {
                                if (this.data[validate].storage.type === "checkbox" || this.data[validate].storage.type === "radio") {
                                    if (local === "checked") {
                                        $(elms[i]).attr("checked", "checked");
                                        if (this.data[validate].storage.type === "radio") {
                                            $(elms[i]).click();
                                        }
                                    }
                                } else {
                                    $(elms[i]).val(local);
                                }
                            }
                        }
                    }
                }

            }
        },

        clearLocalStorage: function () {
            if (mobile && $.isLocalStorageSupported()) {

                for (var validate in this.data) {
                    var elms = this.data[validate].elms[0].split(", ");
                    var storage = this.data[validate].storage;
                    if (elms instanceof Array && storage !== undefined && storage.enabled) {
                        var elmsLength = elms.length;
                        for (var i = 0; i < elmsLength; i++) {
                            localStorage.removeItem('personal.' + $(elms[i]).attr("id"));
                        }
                    }
                }

            }
        },

        generateValidation: function () {

            for (var validate in this.data) {
                if (this.data[validate].elms instanceof Array) {
                    var elmsLength = this.data[validate].elms.length;
                    for (var i = 0; i < elmsLength; i++) {
                        this.connectValidation(
                            this.data[validate].elms[i],
                            this.data[validate]
                        );
                    }
                }
            }
            delete this.data;
        },

        connectValidation: function (elm, data) {

            if ($(elm).length > 0) {
                data.elm = elm;
                this.validateList.push(
                    mote.run('validate.create', data)
                );
            }

        },

        scrollToFirstError: function () {
            var firstErrorFieldset = $(this.form).find('div.error:first').parents('fieldset');
            if (firstErrorFieldset.length > 0) {
                $('html, body').animate({
                    "scrollTop": (firstErrorFieldset.offset().top - 15)
                }, 500);
            }
            return false;
        },

        checkAll: function () {
            this.status = true;

            for (var i = 0; i < this.validateList.length; i++) {
                this.validateList[i].check(true);
                if (this.validateList[i].status === false) {
                    this.status = this.validateList[i].status;
                }
            }

            if (this.status === false) this.scrollToFirstError();

            return this.status;
        },

        bindEvent: function () {
            var self = this;

            $("#back").click(function (e) {
                self.submitTrigger = $(this);
            });

            this.form.submit(mote.doLater(this.checkSubmit, this));
        },

        checkSubmit: function () {

            if (this.submitTrigger === null || this.submitTrigger.attr("id") !== this.preventSubmitCheck) {
                this.checkAll();

                if (this.status === false) return false;

                /* AB-Test BM-44057 skip-confirmation */
                if ($("#next").hasClass("skip-confirmation") === true) {
                    Layovers.show('waiting-confirmation');
                }

                this.clearLocalStorage();

                return true;
            }
        }

    });
})(jQuery);

jQuery(document).ready(function ($) {
    $.fn.validate = function (cfg, data) {
        return this.each(function () {
            mote.run('validate', $(this), cfg, data);
        });
    };
});