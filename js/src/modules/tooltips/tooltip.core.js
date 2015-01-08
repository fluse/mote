/*
    @author      Holger Schauf
    @title       Tipo Tooltips
    @type        core module
    @description core functions to create tooltips with position and content set

    Examples:
    Tooltip with content from title attribute
    $(".storno").tooltip();

    Tooltip with content from string
    $(".storno").tooltip({
        content: '<h3>headline</h3>'
    });

    Tooltip with content from template
    $(".storno").tooltip({
        template: "templateID"
    '});

    Tooltip with content from function
    $(".storno").tooltip({
        content: function();
    '});

    Set a Sticky Tooltip with sticky: true to get a sticky with close button
    $(".storno").tooltip({
        sticky: true
    });

     Build Tooltip Content on INIT
     $(".storno").tooltip({
        preBuild: true,
     });
 */
var preventer = false;
var delayed = true;
var next = false;

var dontHideTips = false;

if (typeof fadeDark === "undefined") {
    var fadeDark = false;
}

if (typeof mobile === "undefined") {
    var mobile = false;
}

var Tipo = (function ($) {
    return Class.extend({

        body: $('body'),
        tip: null,
        backgroundContainer: null,
        content: null,
        avoidPos: "bottom",
        id: (new Date()).getTime(),

        init: function (elm, cfg) {
            executionTime.start("tooltip", "init");
            var settings = {
                position: "bottom",
                width: 300,
                left: 0,
                top: 0,
                margin: 12,
                topMargin: 0,
                leftMargin: 0,
                rightMargin: 0,
                content: '',
                template: false,
                addClass: " ",
                arrow: true,
                arrowTop: 0,
                arrowLeft: 0,
                sticky: false,
                execute: "",
                run: "",
                closeButton: false,
                preBuild: false,
                closeDelay: false,
                gaPush: false,
                fadeDark: fadeDark,
                focusByDarkBackground: false,
                specialTooltip: false,
                arrowPosition: false,
                special: false
            };

            this.cfg = $.extend(settings, cfg);
            this.elm = elm;
            this.behind_background = null;
            this.sticky = false;

            if (mobile === true) {
                this.cfg.sticky = true;
                this.cfg.closeButton = true;
            }
            executionTime.stop("tooltip", "init");

            this.setEvents(this);

            if (this.cfg.special === "showOnLoad" && $(this.elm).is(":visible")) {
                this.showAfterSeconds(this, 3);
                this.hideAfterSeconds(this, 11);
            }

            if (this.cfg.preBuild === true) this.buildTip(this);
        },

        toggle: function () {

            if (this.tip === null) {
                this.showTooltip(this);
                return false;
            }

            this.tip.is(":visible") && (this.sticky === false || mobile)
                ? this.hideTooltip(this)
                : this.showTooltip(this);

        }
    });
})(jQuery);

Tipo.prototype.source = function (self) {
    // used in debug mode
    executionTime.start("tooltip", "source");
    // normalize tip content source
    if (self.cfg.content === '' && self.cfg.template === false) {

        if ($(self.elm).attr('title') === undefined || $(self.elm).attr('title') === '') return false;

        self.content = $(self.elm).attr('title');

        $(self.elm).removeAttr('title');

    } else if (typeof self.cfg.content === "function") {

        self.cfg.content = self.cfg.content();

        if ($("#" + self.cfg.template).length === 0) return false;

        for (var i in self.cfg.content) {
            $("#" + self.cfg.template).find(i).html(self.cfg.content[i]);
        }

        if ($("#" + self.cfg.template).length === 0) return false;

        self.content = $("#" + self.cfg.template).html();

    } else if (self.cfg.template !== false) {

        if ($("#" + self.cfg.template).length === 0) return false;

        self.content = $("#" + self.cfg.template).html();

    } else {

        if (self.cfg.content === undefined) {
            return false;
        }

        self.content = self.cfg.content;
    }

    if (self.content === null) return false;

    executionTime.stop("tooltip", "source");
};

Tipo.prototype.hideTooltip = function (self) {
    if (dontHideTips === true) {
        return false;
    }
    executionTime.start("tooltip", "hideTooltip");

    if (self.behind_background) {
        self.behind_background
            .stop(true)
            .animate({'opacity': 0}, 500, function() {
                if ( typeof loadResults !== 'undefined' ) {
                    loadResults.resume();
                }
             }
        );
    }

    $("#" + self.id).hide().remove();
    self.sticky = false;
    executionTime.stop("tooltip", "hideTooltip");
};

Tipo.prototype.execute = function (run) {
    if (jQuery.isArray(run) === true) {
        for (var i = 0; i <= run.length; i++) {
            jQuery.getScript(run[i]);
        }
    } else {
        jQuery.getScript(run);
    }
};

Tipo.prototype.run = function (run) {
    eval(run);
};

Tipo.prototype.showAfterSeconds = function (self, seconds) {
    setTimeout(function () {
        self.showTooltip(self);
    }, (seconds * 1000));
};

Tipo.prototype.hideAfterSeconds = function (self, seconds) {
    setTimeout(function () {
        self.hideTooltip(self);
    }, (seconds * 1000));
};

var TipoBuild = function (el, cfg) {

    if (el.data("tooltip") === undefined) {
        el.data("tooltip", new Tipo(el, cfg));
    }
};

var TipoInitByAttr = function (context) {
    executionTime.start("tooltip");

    executionTime.start("tooltip", "selectionOnly");
    var tipos = jQuery("[tipo]", (context !== undefined) ? context : "");
    executionTime.stop("tooltip", "selectionOnly");

    executionTime.start("tooltip", "buildInEach");
    tipos.each(function () {
        TipoBuild(jQuery(this), jQuery.parseJSON(jQuery(this).attr("tipo")));
    });
    executionTime.stop("tooltip", "buildInEach");

    executionTime.stop("tooltip");
};

var TipoInitSingle = function (el) {
    TipoBuild(el, jQuery.parseJSON(el.attr("tipo")));
};

(function ($) {
    $.fn.tooltip = function (cfg) {
        return this.each(function () {
            TipoBuild($(this), cfg);
        });
    };
})(jQuery);

jQuery(document).ready(function () {
    TipoInitByAttr();
});
