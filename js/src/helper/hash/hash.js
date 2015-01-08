/*
 * @autor        Holger Schauf
 * @title        url hash manager
 * @type         helper
 * @description  manage url hash for behavior
 */

mote.register("hash");

mote.hash = {

    app: {
        name: "hash",
        autor: "Holger Schauf",
        version: "0.0.1"
    },

    url: [],

    seperator: {
        url: '/',
        add: '&',
        val: '=',
        set: ',',
        key: '_'
    },

    keyTypeBehavior: {

        check: function (el, val) {
            $("#" + el).attr("checked", val);
        },

        link: function (el, val) {
            $("#" + el).attr("href", val);
        },

        input: function (el, val) {
            $("#" + el).val(val);
        }

    },

    check: function () {
        if (window.location.hash)
            this.grep();
    },

    grep: function () {

        this.url = this.getUrls();

        var urls = this.url;

        return true;
        for (var fragment = 0; fragment < urls.length; fragment++)
            this.url.push(
                this.decode(urls[fragment])
            );

    },

    getUrls: function () {
        var test = '#/artist&check_test=test,test2=test/1';

        return window.location.hash.split('#')[1].split(this.seperator.url);
    },

    /**
     *
     * @param part
     * @returns {{name: string, additionals: (string|boolean)}}
     */
    decode: function (part) {

        // get
        var tmp = part.split(this.seperator.add);

        return tmp[0];


        return {
            name: tmp[0],
            additionals: tmp[1] || false
        }
    },

    getAdditionals: function () {
        part.split(this.seperator.add)
    },

    setUrl: function (depth, part) {
        this.url[depth] = part;
        window.location.hash = this.url.join(this.seperator.url);
    },

    setAdditionalToUrl: function (depth, additional) {

    },

    getState: function (depth) {
        return this.url[depth] || false;
    }

};

mote.hash.check();