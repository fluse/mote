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
    .script("../modules/layer/layer.js")
    .wait(function () {
        startlayerTest();
    });


function startDiceTest() {

    module("layer");
    test("layer", function () {

    });

}