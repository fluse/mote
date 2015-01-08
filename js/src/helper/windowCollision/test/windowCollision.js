/*
 * @autor      Holger Schauf
 * @brief      test
 */

$LAB.script("../components/jquery.js").wait()
    .script("../core/inheritance.js").wait()
    .script("../testing/qunit.js")
    .script("../core/mote.js")
    .script("../core/log.js")
    .script("../helper/windowCollision/windowCollision.js")
    .wait(startWindowCollisionTest);


function startWindowCollisionTest() {

    module("windowCollision");
    test("windowCollision", function () {

        var elementPosition = {
            top: 10,
            width: 100,
            height: 100,
            left: 0
        };

        var response = mote.WindowCollision.check(elementPosition);

        ok(response.status, "Element is Inside Window");

    });

}