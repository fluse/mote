/*
 @author      Holger Schauf
 @title       executionTime
 @type        measure module
 @description get execution time of several function
 */

mote.register("measure", {
    copyright: 'Holger Schauf',
    name: 'measure'
});

mote.measure = {

    measurements: [],

    startTime: null,

    /**
     * // start measure
     * @returns {number}
     */
    start: function () {

        this.startTime = this.setTimes();
        return this.startTime;
    },

    /**
     *
     * @param name
     * @returns {boolean}
     */
    stop: function (name) {

        if (typeof name === 'undefined') return false;

        if (!this.measurements.hasOwnProperty(name)) this.measurements[name] = [];

        this.measurements[name].push(this.getTime());

        console.info(this.measurements[name]);

        return true;
    },

    /**
     *
     * @returns {number}
     */
    setTimes: function () {
        return (1 * new Date());
    },

    /**
     *
     * @returns {boolean}
     */
    getTime: function () {
        if (this.startTime !== null) {
            try {
                var endTimestamp = this.setTimes();
                $.extend(this.startTime, {
                    startTime: this.startTime,
                    endTimestamp: endTimestamp,
                    duration: (endTimestamp - this.startTime)
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    }

};