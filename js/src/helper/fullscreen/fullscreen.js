mote.register("Fullscreen");

mote.Fullscreen = (function ($, docElm) {
    return {

        /**
         * go into Fullscreen
         * @returns {*}
         */
        enable: function () {

            var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||
                (document.mozFullScreen || document.webkitIsFullScreen);

            if (isInFullScreen) return false;

            if (docElm.requestFullscreen)
                return docElm.requestFullscreen();

            if (docElm.mozRequestFullScreen)
                return docElm.mozRequestFullScreen();

            if (docElm.webkitRequestFullScreen)
                return docElm.webkitRequestFullScreen();

            return false;
        },

        /**
         * Exit Fullscreen
         * @returns {*}
         */
        exit: function () {

            if (document.exitFullscreen)
                return document.exitFullscreen();

            if (document.mozCancelFullScreen)
                return document.mozCancelFullScreen();

            if (document.webkitExitFullscreen)
                return document.webkitExitFullscreen();

        }

    };
})(jQuery, document.documentElement);
