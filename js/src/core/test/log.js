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
    .script("../core/mote.js").wait()
    .script("../core/log.js")
    .wait(startLogTests);

function startLogTests () {

    // set group
    module("log");

    test("check log functionality", function () {

        // settings
        mote.mode = {
            debug: true,
            intern: true,
            record: true
        };

        strictEqual(logo.add("error", {}), true, "log entry pushed");

        // settings
        mote.mode.record = false;

        strictEqual(logo.add("error", {}), false, "log entry on mode.debug=false not pushed");

        // settings
        mote.mode = {
            debug: true,
            intern: false,
            record: true
        };

        strictEqual(logo.add("error", {}), false, "log entry on mode.intern=false not pushed");

        // settings
        mote.mode = {
            debug: true,
            intern: true,
            record: false
        };

        strictEqual(logo.add("error", {}), false, "log entry on mode.intern=record not pushed");

        // settings
        mote.mode = {
            debug: false,
            intern: true,
            record: true
        };

        for (var i = 0; i < 55; i++) {
            logo.add("executed", {
                name: "test"
            });
        }

        strictEqual(logo.logs['executed'].length === logo.cfg.maxLogLength, true, "log is cutted to " + logo.cfg.maxLogLength + " childs" );

        strictEqual(logo.clear("executed"), true, "log executed was cleared");

        strictEqual(logo.clear("notThere"), false, "log not available");

        for (var i = 0; i < 5; i++) {
            logo.add("executed", {
                name: "test"
            });
        }
        ok(logo.get("executed").length > 0, "get log executed");

        // settings
        mote.mode = {
            debug: false,
            intern: false,
            record: false
        };

        logo.clear('executed');

        ok(logo.get("executed").length === 0, "log have to be empty");

    });

}