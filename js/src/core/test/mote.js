/*
 * @autor      Holger Schauf
 * @brief      test
 */

/*
 * Load Required JS Files "related path"
 */
$LAB.script("../components/jquery.js").wait()
    .script("../core/inheritance.js").wait()
    .script("../testing/qunit.js")
    .script("../core/mote.js")
    .script("../core/log.js")
    .script("../modules/dice/dice.js")
    .wait(startEngineTests);


function startEngineTests () {

    // set group
    module("mote");

    test("globals", function () {
        testObj = {
            hoku: true,
            spok: false,
            us: true
        };
        ok(mote.allPropTrue(testObj) === false, "allPropTrue() not all props true");
        testObj = {
            hoku: true,
            spok: true,
            us: true
        };
        ok(mote.allPropTrue(testObj) === true, "allPropTrue() all props true");
    });

    test("properties check", function () {
        strictEqual(mote.hasOwnProperty("mode"), true, 'mode is available');
        strictEqual(mote.hasOwnProperty("lang"), true, 'lang is available');
        strictEqual(mote.hasOwnProperty("register"), true, 'register is available');
        strictEqual(mote.hasOwnProperty("run"), true, 'run is available');
        strictEqual(mote.hasOwnProperty("prop"), true, 'run is available');
    });

    test("app", function () {
        var app = mote.run('Dice');

        strictEqual(typeof app === 'object', true, 'check run method');

        strictEqual(mote.applications.hasOwnProperty('Dice'), true, 'check mote has add application storage');

        strictEqual(mote.applications['Dice'].length > 0, true, 'check mote has insert app into app storage');
    });
}