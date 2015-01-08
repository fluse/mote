/*
 * @autor      Holger Schauf
 * @brief      test
 */

/*
 * Load Required JS Files "related path"
 */

function buildTemplate () {
    /*
     * Generate Templates
     */
    var dropOptions = [{
        name: "test",
        val: "testVal"
    },{
        name: "test2",
        val: "testVal"
    },{
        name: "test3",
        val: "testVal"
    }];

    var html = "";
    for (var i = 0; i < 10; i++) {

        html += '<select id="DropDown' + i + '" name="dropdown">';

        for (var o = 0; o < dropOptions.length; o++) {
            html += '<option value="' + dropOptions[o].val + '">' + dropOptions[o].name + '</option>';
        }
        html += '</select>';
    }
    var d1 = document.getElementById('body');
    d1.insertAdjacentHTML('beforeend', html);
}

buildTemplate();

$LAB.script("../components/jquery.js").wait()
    .script("../core/inheritance.js").wait()
    .script("../testing/qunit.js")
    .script("../core/log.js")
    .script("../core/measure.js")
    .script("../core/mote.js")
    .script("../modules/dropdown/dropdown.js")
    .wait(function () {
        startDropDownTest();
    });


function startDropDownTest() {

    module("DropDownTest");
    test("DropDownTest", function () {

        var dropDownTestSettings = {
            elm: "#DropDownStatic"
        };

        var testDropDown = mote.run('DropDown', dropDownTestSettings);

        for (var i = 0; i < 10; i++) {
            mote.run('DropDown', {
                elm: "#DropDown" + i
            });
        }

        ok($("#" + testDropDown.cfg.dropsAreaName).length > 0, "list wrapper is created");
        ok($(testDropDown.container).length > 0, "list markup is created");
        ok($(testDropDown.input).length > 0, "input markup is created");
        ok(typeof testDropDown.setupContainer(testDropDown) === "object", "setup list container with event");

        testDropDown.open();
        ok($(testDropDown.container).is(":visible"), "List is open");

        testDropDown.close();
        ok($(testDropDown.container).is(":hidden"), "List is closed");

        ok($(testDropDown.setCurrent(testDropDown.moveOne(2))).hasClass("selected"), "move up and check selection");

        ok($(testDropDown.setCurrent(testDropDown.moveOne(-2))).hasClass("selected"), "move down and check selection");
    });

}