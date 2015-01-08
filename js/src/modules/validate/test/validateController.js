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
    .script("../core/mote.js")
    .script("../core/log.js")
    .script("../modules/dropdown/dropdown.js")
    .wait(function () {
        startDropDownTest();
    });


function startDropDownTest() {

    module("DropDown");
    test("DropDown", function () {

        var dropDownTestSettings = {
            elm: "#DropDownStatic"
        };

        var testDropDown = new mote.DropDown(dropDownTestSettings);
        ok(testDropDown.app.name === "DropDown", "DropDown instance is created");

        for (var i = 0; i < 10; i++) {
            new mote.DropDown({
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

        testDropDown.open();
        ok($(testDropDown.setCurrent(testDropDown.moveOne(2))).hasClass("selected"), "move up and check selection");

        testDropDown.elm.trigger("click");

    });

}