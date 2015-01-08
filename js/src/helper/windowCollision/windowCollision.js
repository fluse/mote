/*
 * @autor        Holger Schauf
 * @title        window collision test
 * @type         module animation
 * @description  check each window edge for collision
 */

mote.register("WindowCollision");

mote.WindowCollision = {

    app: {
        name: "WindowCollisionCheck",
        autor: "Holger Schauf",
        version: "0.0.1"
    },

    cfg: {
        restrict: 0
    },

    browser: {},
    element: null,

    /**
     *
     * @param element
     * @returns {{status: boolean, correction: {}}}
     */
    check: function (element) {
        this.element = element;
        this.browser = mote.getWindowSize(true);

        var status = false;
        var correction = {};

        for (var bound in this.bound) {

            // check each edge
            var check = this.bound[bound](this.element, this.cfg.restrict, this.browser);

            // edge collision status
            if (check.status) {
                correction = $.extend({}, correction, check.correction);
                status = true;
            }

            status = status ? true : false;
        }

        return {
            status: status,
            correction: correction
        };
    },

    // check sets for each bound
    bound: {
        /**
         *
         * @param e = element
         * @param r = restrict
         * @param b = browser
         * @returns {{status: boolean, correction: {top: number}}}
         */
        top: function (e, r, b) {
            var status = ((e.top + window.pageYOffset) - r) < 0 ? true : false;

            return {
                status: status,
                correction: {
                    top: 0
                }
            };
        },

        /**
         *
         * @param e = element
         * @param r = restrict
         * @param b = browser
         * @returns {{status: boolean, correction: {right: number, left: number}}}
         */
        right: function (e, r, b) {

            var status = (e.width + r + e.left) > b.width ? true : false;

            return {
                status: status,
                correction: {
                    right: 0,
                    left: ""
                }
            };
        },

        /**
         *
         * @param e = element
         * @param r = restrict
         * @param b = browser
         * @returns {{status: boolean, correction: {bottom: number, top: number, position: string}}}
         */
        bottom: function (e, r, b) {

            var status = (e.height + r + (e.top - window.pageYOffset)) > b.height ? true : false;

            return {
                status: status,
                correction: {
                    bottom: 0,
                    top: "",
                    position: "fixed"
                }
            };
        },

        /**
         *
         * @param e = element
         * @param r = restrict
         * @param b = browser
         * @returns {{status: boolean, correction: {left: number}}}
         */
        left: function (e, r, b) {

            var status = (e.left - r) < 0 ? true : false;

            return {
                status: status,
                correction: {
                    left: 0
                }
            };
        }
    }
};