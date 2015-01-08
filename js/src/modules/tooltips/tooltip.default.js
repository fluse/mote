/*
    @author      Holger Schauf
    @title       Tipo Tooltips
    @type        extention module
    @required    jquery.tooltip.core.js
    @description set default desktop events, apperience and behaviors
 */

Tipo.prototype.setEvents = function (self) {
    executionTime.start("tooltip", "events");

    self.id = (new Date()).getTime();

    if (self.cfg.sticky === true) {
        self.sticky = true;
        self.elm.click(function () {
            self.toggle();
            return false;
        });
    } else {
        self.elm.hover(function () {
            clearTimeout(next);
            clearTimeout(preventer);
            if (delayed === true) {
                window.instantPrevent = setTimeout(function(){
                    self.showTooltip(self);
                }, 80);
            } else {

                next = window.setTimeout(function () {
                    self.showTooltip(self);
                }, ((self.cfg.closeDelay / 2) * 1000));
            }
        }, function () {
            if (self.cfg.closeDelay !== false) {
                delayed = false;

                preventer = window.setTimeout(function () {
                    delayed = true;

                    if (self.sticky === false) {
                        self.hideTooltip(self);
                    }

                }, (self.cfg.closeDelay * 1000));
            } else {
                clearTimeout(window.instantPrevent);
                self.sticky = false;
                self.hideTooltip(self);
            }
        });
        //prevent click on empty or # href
        self.preventClick(self.elm);
    }

    // bind check event to element
    self.elm.bind("tipRefresh", function () {
        self.refresh(self);
    });

    // bind timed show event to element
    self.elm.bind("tipShow", function () {
        self.showTooltip(self);
        self.hideAfterSeconds(self, 11);
    });

    executionTime.stop("tooltip", "events");
};

Tipo.prototype.refresh = function (self) {
    self.buildTip(self);
    self.setPosition(self);
    self.resetEvent(self);
    $("#" + self.id).html(self.tip.html());
};

Tipo.prototype.buildTip = function (self) {
    executionTime.start("tooltip", "buildTip");

    if (false === self.source(self)) {
        return false;
    }

    var close = (self.cfg.closeButton === true) ? '<a id="close" class="' + self.cfg.position + '"></a>' : '';

    var arrow = "";

    if (self.cfg.arrow === true) {

        if (self.cfg.arrowTop > 0) {
            arrow = '<span id="arrow" style="top: ' + self.cfg.arrowTop + 'px;"></span>';
        } else if (self.cfg.arrowLeft > 0) {
            arrow = '<span id="arrow" style="left: ' + self.cfg.arrowLeft + 'px;"></span>';
        } else {
            arrow = '<span id="arrow"></span>';
        }
    }

    if (self.cfg.sticky === true || self.cfg.closeButton === true) {
        self.cfg.addClass = self.cfg.addClass + " sticky";
    }

    self.tip = $('<div id="' + self.id + '" class="cf tooltip ' + self.cfg.addClass + '">' + close + arrow + self.content + '</div>');

    if (self.cfg.closeDelay !== false) {
        $(document).on({
            mouseleave: function () {
                sticky = false;
                window.setTimeout('' + self.hideTooltip(self) + '', 70);
            }
        }, '.tooltip');
    }

    if ($('#gridResults').length !== 0 ) {
        self.backgroundContainer = $('#gridResults');
    } else {
        self.backgroundContainer = self.tip;
    }

    if (self.cfg.execute.length > 0) self.execute(self.cfg.execute);
    if (self.cfg.run.length > 0) {
        setTimeout(function () {
            self.run(self.cfg.run);
        }, 400);
    }
    executionTime.stop("tooltip", "buildTip");
};

Tipo.prototype.setPosition = function (self) {
    executionTime.start("tooltip", "setPosition");

    if (self.cfg.width > 0) {
        self.tip.css({
            width: self.cfg.width
        });
    }
    self.inArea(self);

    // get Position of trigger Element
    var pos = $.extend({}, self.elm.offset(), {
        width: self.elm.outerWidth(true),
        height: self.elm.outerHeight(true)
    });

    var tipWidth = self.tip.outerWidth(true);
    var elHeight = self.elm.height();
    var windowHeight = $(window).height();
    var cfgTop = parseInt(self.cfg.top, 10);
    var cfgMargin = parseInt(self.cfg.margin, 10);
    var cfgLeft = parseInt(self.cfg.left, 10);
    var cfgLeftMargin = parseInt(self.cfg.leftMargin, 10);
    var cfgRightMargin = parseInt(self.cfg.rightMargin, 10);
    var offsetTop = self.elm.offset().top;
    var scrollTop = $(document).scrollTop();
    var outerHeight = self.tip.outerHeight(true);

    if (self.avoidPos === 'bottom') {
        self.tip.css({
            top: pos.top + elHeight + cfgMargin + cfgTop + 2,
            left: (pos.left + pos.width / 2 - tipWidth / 2) + cfgLeftMargin - cfgRightMargin
        });

    } else if (self.avoidPos === 'left') {
        self.tip.css({
            top: (pos.top + pos.height / 2 - 18) + cfgTop,
            left: pos.left - tipWidth - cfgMargin + cfgLeft
        });

    } else if (self.avoidPos === 'right') {
        self.tip.css({
            top: (pos.top + pos.height / 2 - 18) + cfgTop,
            left: pos.left + pos.width + cfgMargin + cfgLeft
        });

    } else if (self.avoidPos === 'leftbottom') {
        self.tip.css({
            top: pos.top + elHeight + parseInt(self.cfg.topMargin, 10) + cfgTop,
            left: pos.left + pos.width - tipWidth - cfgMargin
        });

    //new temp positions if tip outside view
    } else if (self.avoidPos === 'top') {
        self.tip.css({
            top:  pos.top - outerHeight - cfgMargin,
            left: (pos.left + pos.width / 2 - tipWidth / 2) + cfgLeftMargin - cfgRightMargin
        });

    } else if (self.avoidPos === 'leftspecial') {
        self.tip.css({
            top:  offsetTop  - (offsetTop - scrollTop + outerHeight - windowHeight) - 12,
            left: pos.left - tipWidth - 10 + cfgLeft
        });

    } else if (self.avoidPos === 'rightnew') {
        self.tip.css({
            top:  offsetTop  - (offsetTop - scrollTop + outerHeight - windowHeight),
            left: pos.left + pos.width + cfgMargin + cfgLeft
        });

    } else if (self.avoidPos === 'leftnew') {
        self.tip.css({
            top:  offsetTop  - (offsetTop - scrollTop + outerHeight - windowHeight),
            left: pos.left - tipWidth - cfgMargin + cfgLeft
        });
    }

    //set new temp position for arrow
    var temparrow = self.tip.find("#arrow");
    temparrow.attr("class", self.avoidPos);

    if (self.avoidPos === 'leftspecial' || self.avoidPos === 'rightnew' || self.avoidPos === 'leftnew') {
        var arrowCssTop = offsetTop - parseInt(self.tip.css("top"));
        temparrow.css({
            top: arrowCssTop
        });
    } else if (self.cfg.arrowLeft > 0) {
    } else {
        temparrow.attr("style", "");
    }
    executionTime.stop("tooltip", "setPosition");
};

Tipo.prototype.inArea = function (self) {
    executionTime.start("tooltip", "checkInArea");
    var windowHeight = $(window).height();
    var maxOuter = (($(self.elm).offset().top - $(document).scrollTop()) + $("#" + self.id).outerHeight(true));

    if (self.cfg.position == "bottom") {
        maxOuter += 50;
    }

    if (windowHeight < maxOuter) {

        if (self.cfg.position == "bottom") {
            self.avoidPos = "top";

        } else if (self.cfg.position == "right") {
            self.avoidPos = "rightnew";

        } else if (self.cfg.position == "left") {
            self.avoidPos = "leftnew";

        } else if (self.cfg.position == "leftbottom") {
            self.avoidPos = "leftspecial";
        }

    } else {
        self.avoidPos = self.cfg.position;
    }
    executionTime.stop("tooltip", "checkInArea");
};

Tipo.prototype.showTooltip = function (self) {
    executionTime.start("tooltip", "showTooltip");

    if ($(self.tip).is(":visible")) return false;

    if (mobile) {
        $('.tooltip').remove();
    } else {
        if ($(".tooltip").is(":visible")) {
            self.hideTooltip(self);
        } else {
            preventer = false;
        }
    }

    if (preventer !== false) {
        clearTimeout(preventer);
    }

    if (self.elm.parents(".tooltip").length > 0) {
        $(".tooltip").not("#" + self.elm.parents(".tooltip").attr("id")).not("#" + self.id).remove();
    } else {
        $(".tooltip").not("#" + self.id).remove();
    }

    if (self.cfg.gaPush !== false) {
        self.cfg.gaPush.push();
    }

    if (self.tip === null) {
        self.buildTip(self);
    }

    if (self.body.length === 0) {
        self.body = $('body');
    }

    if (self.tip !== null) {

        self.body.append(self.tip.show());

        self.setPosition(self);

        if (mobile && $.fn.scrollintoview) {
            window.setTimeout(function () {
                self.tip.scrollintoview({
                    duration: "slow"
                });
            }, 200);
        }

        self.resetEvent(self);

        if (self.cfg.closeDelay !== false) {
            self.preventEvent(self);
        }

        if (self.cfg.fadeDark) {
            self.createFocusBackground(self);
        }

    }

    executionTime.stop("tooltip", "showTooltip");

};

Tipo.prototype.createFocusBackground = function (self) {
    if (typeof loadResults !== 'undefined') {
        loadResults.pause();
    }

    if (self.behind_background === null) {
        self.behind_background = self.getBackgroundElement(self);
    }

    self.behind_background
        .stop(true)
        .delay(700)
        .animate({'opacity': 1.0}, 2500);
}

Tipo.prototype.getBackgroundElement = function (self) {
    var result = $('#tooltipBehindBackground');

    if (result.length) {
        return result;
    }

    return $('<div id="tooltipBehindBackground" class="tooltip-behind-background"><svg class="tooltip-behind-background"></svg></div>')
        .insertBefore(self.backgroundContainer)
        .css({'opacity': 0});
}

Tipo.prototype.resetEvent = function (self) {
    executionTime.start("tooltip", "resetEvent");
    if (self.cfg.sticky === true) {

        self.sticky = true;

        $(".tooltip").outerclick(function () {
            self.sticky = false;
            self.hideTooltip(self);
            return false;
        });
    }

    if (self.cfg.closeButton === true) {

        $("#" + self.id).find("#close").click(function () {
            self.hideTooltip(self);
            return false;
        });
    }
    executionTime.stop("tooltip", "resetEvent");
};

Tipo.prototype.preventClick = function (elm) {
    if (elm.attr("href") !== undefined && (elm.attr("href") === "#" || elm.attr("href") === "")) {
        elm.click(function (e) {
            e.preventDefault();
        });
    }
};

Tipo.prototype.preventEvent = function (self) {
    $(".tooltip").mouseenter(function () {
        self.sticky = true;
        clearTimeout(next);
    });
};
