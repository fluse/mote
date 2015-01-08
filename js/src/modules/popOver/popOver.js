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

mote.register("PopOver", {
    copyright: "Holger Schauf",
    name: "PopOver",
    version: "0.0.1"
});

mote.PopOver = (function ($) {
    return Class.extend({

        init: function (cfg) {

            // set config
            this.cfg = $.extend({
                inputClass: "dropdown",
                dropsAreaName: "drops",
                containerClass: "dropdown-wrapper",
                hoverClass: "hover",
                currentClass: "selected"
            }, cfg);

        }
    });
})(jQuery);