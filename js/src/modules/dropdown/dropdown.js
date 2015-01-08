/*
 @require     jquery.js
 @require     inheritance.js

 @author       Holger Schauf
 @title        Dropdown Lists
 @type         module
 @description  css customizable dropdown elements

 @example      var dropdown = new mote.DropDown(); dropdown.open();
 @example      mote.run('DropDown').open();
 */

mote.register("DropDown");

mote.DropDown = (function ($) {
    return Class.extend({

        settings: {
            inputClass: "dropdown",
            dropsAreaName: "drops",
            containerClass: "dropdown-wrapper",
            hoverClass: "hover",
            currentClass: "selected"
        },

        active: -1,
        hasFocus: false,
        openByClick: false,
        prevSearch: null,

        init: function (cfg) {

            // set config
            this.cfg = $.extend(this.settings, cfg);

            //cache jquery elm object
            this.elm = $(this.cfg.elm);
            if (this.elm.length === 0) {
                logo.add("warning", {
                    name: this.app.name,
                    settings: this.cfg,
                    notice: "element was not found"
                });
                return false;
            }
            // create new dropdown list
            this.container = this.setupContainer(this);
            //jquery input object
            this.input = this.setupInput();
            // hide select and append newly created elements
            this.elm.hide().before(this.input);
            // append new droplist items to droplist wrapper
            this.container.html(this.convertOptions());

            // append new droplist to body
            if ($("#" + this.cfg.dropsAreaName).length === 0) $("body").append('<div id="' + this.cfg.dropsAreaName + '"></div>');
            $("#" + this.cfg.dropsAreaName).append(this.container);

            // set droplist events
            this.setDropdownEvent(this);
        },

        /**
         * open dropdown and set active as focus
         * @returns {*}
         */
        open: function () {
            this.input.addClass("active");
            this.setScrollPosition(this.elm);
            this.setPosition(this.container, this.input);
            this.container.show();
            return this.container.is(":visible");
        },

        /**
         * hide list and reset helper vars
         */
        close: function () {
            this.hasFocus = false;
            this.openByClick = false;
            this.container.hide();
            this.input.removeClass("active");
        },

        /**
         * move
         * @param i
         * @returns {*}
         */
        moveOne: function (i) {
            this.active += i;
            return this.move();
        },

        /**
         * move to index of active element
         * @returns {*}
         */
        move: function () {

            var lis = $(this.container).find("li");

            if (!lis) return false;
            // select first
            if (lis.length <= this.active) this.active = 0;
            // select last
            if (this.active < 0) this.active = lis.length - 1;

            // scroll to selected index position
            this.setScrollPosition($(lis[this.active]));

            // remove old classes and set new active class
            lis.removeClass(this.cfg.hoverClass);
            $(lis[this.active]).addClass(this.cfg.hoverClass);
            return $(lis[this.active]);
        },

        /**
         * set new selected value on dropdown, input and select
         * @param current
         * @returns {*|HTMLElement}
         */
        setCurrent: function (current) {
            current = $(current);
            // remove all old current classes
            this.container.find("li").removeClass(this.cfg.currentClass);
            // set new current in dropdown
            current.addClass(this.cfg.currentClass);
            // save to visible input
            this.input.val(current.html());
            // save to original select
            $(this.elm).val(current.attr("rel")).change();

            return current;
        },

        convertOptions: function () {
            var self = this;
            var ul = document.createElement("ul");
            var list = "";
            this.elm.children("option").each(function () {
                list += self.buildList($(this));
            });
            // hover event
            $(ul).html(list).find("li").hover(function (e) {
                $(this).toggleClass(self.cfg.hoverClass);
            }).click(function () {
                    self.setCurrent($(this));
                    self.close();
                });
            $(ul).css("width", this.elm.outerWidth(true));
            return ul;
        }
    });
})(jQuery);

/**
 * create html for each dropdown element
 * @param current
 * @returns {string}
 */
mote.DropDown.prototype.buildList = function (current) {
    var li = '<li rel="' + current.val();
    if (current.is(':selected')) {
        li += '" class="' + this.cfg.currentClass;
        this.input.val(current.html());
    }
    li += '">' + current.html() + '</li>';
    return li;
};

/**
 * create wrapper div for dropdown list
 * @param self
 * @returns {*|jQuery}
 */
mote.DropDown.prototype.setupContainer = function (self) {

    var container = $(document.createElement("div"))
        .attr("class", this.elm.attr("class") + " " + this.cfg.containerClass).hide();

    // set absolute position of dropdown list
    this.setPosition(container, this.elm);

    // hasFocus true prevent hidding
    $(container).mouseover(function () {
        self.hasFocus = true;
    }).mouseout(function () {
        self.hasFocus = false;
        if (self.container.is(":visible")) self.input.focus();
    });

    return container;
};

/**
 * create input to replace it with select
 * @returns {*|jQuery}
 */
mote.DropDown.prototype.setupInput = function () {
    var classes = typeof this.elm.attr("class") !== 'undefined' ? " " + this.elm.attr("class") : "";
    var input = $(document.createElement("input")).attr({
        "class": this.cfg.inputClass + classes,
        type: "text",
        autocomplete: "off"
    });
    if (this.elm.get(0).id.length > 0) input.attr("id", this.elm.get(0).id);
    this.elm.removeAttr("id");
    return input;
};

/**
 * set Event on select replaced input
 * @param self
 */
mote.DropDown.prototype.setDropdownEvent = function (self) {

    /* on mouse down not on click because
     * mousedown before focus focus before click reaction
     */
    self.input.bind("mousedown.DropDown", function () {
        if (self.container.is(":hidden") && self.openByClick !== true) {
            self.openByClick = true;
            self.open();
        } else {
            if (self.hasFocus !== true) self.close();
        }
        logo.add("events", {
            name: self.cfg.elm,
            trigger: "mouse",
            desc: "select option"
        });
    }).bind("focus.DropDown", function () {
            if (self.container.is(":hidden") && self.openByClick !== true) self.open();
        }).bind("keydown.DropDown", function (e) {
            switch(e.keyCode) {
                // key up
                case 38:
                    e.preventDefault();
                    // reopen dropdown if it was closed else move one up
                    self.container.is(":hidden") ? self.open() : self.moveOne(-1);
                    break;
                // key down
                case 40:
                    e.preventDefault();
                    // reopen dropdown if it was closed else move one down
                    self.container.is(":hidden") ? self.open() : self.moveOne(1);
                    break;
                // return and set current hover as new val
                case 13:
                    if (self.container.is(":visible")) {
                        e.preventDefault();
                        $('li.' + self.cfg.hoverClass).trigger('click');
                    }
                    break;
                //escape to abort
                case 27:
                    self.close();
                    break;
                default:
                    // each other key used to jump to item with matched on first letter
                    self.jumpToMatch(self.container, $(this).val());
                    self.open();
                    break;
            }
        }).bind("blur.DropDown", function () {
            if ((self.hasFocus === false && self.container.is(":visible"))) {
                self.close();
            }
        });
};

/**
 * Set dropdown absolute position related to body
 * @param container
 * @param elm
 */
mote.DropDown.prototype.setPosition = function (container, elm) {
    var height = $(elm).outerHeight(true);
    var pos = $.extend({}, $(elm).offset(), {
        width: $(elm).outerWidth(true),
        height: height
    });
    $(container).css({
        top: pos.top + height,
        left: pos.left
    });
};

/**
 * set the hovered element centered in dropdown list
 * @param elm
 */
mote.DropDown.prototype.setScrollPosition = function (elm) {
    // Math middle
    var centered = ((this.container.outerHeight(true) / elm.outerHeight(true)) / 2);
    // Math height
    var height = elm.prevAll('li').outerHeight() * (elm.prevAll('li').length - centered);
    // set dropdown scroll position
    this.container.find('ul').animate({scrollTop: height + 'px' }, 0);
};

/**
 * Search in List for first Letter and jump onto this position and mark list element as hover
 * @param container
 * @param search
 */
mote.DropDown.prototype.jumpToMatch = function (container, search) {
    var list = "";
    if ($(container).find(".hover").length !== 0 && this.prevSearch === search) {
        list = container.find(".hover").nextAll('li');
    } else {
        list = container.find("li");
    }
    var self = this;

    list.each(function () {
        if ($(this).text().charAt(0).toUpperCase().match(search.charAt(0).toUpperCase())) {
            self.active = $(this).index();
            self.move();
            return false;
        }
    });
    this.prevSearch = search;
    logo.add("events", {
        name: this.cfg.elm,
        trigger: "key",
        desc: "",
        notice: search
    });
};

(function ($) {
    $.fn.dropdown = function (cfg) {
        if (typeof cfg === 'undefined') {
            cfg = {};
        }
        return this.each(function () {
            cfg.elm = this;
            new mote.DropDown(cfg);
        });
    };
    // init each select by class ".dropdown"
    $("select.dropdown").dropdown();
})(jQuery);