/*
 * @autor      Holger Schauf
 * @brief      test
 */

var d1 = document.getElementById('body');
d1.insertAdjacentHTML('beforeend', '<div class="toggle-container"><div class="trigger"></div><div class="target" style="display: none">test</div></div>');

$LAB.script("../components/jquery.js").wait()
    .script("../core/inheritance.js").wait()
    .script("../testing/qunit.js")
    .script("../core/mote.js")
    .script("../core/log.js")
    .script("../helper/toggle/toggle.js")
    .wait(startToggleTest);


function startToggleTest() {

    module("toggle");
    test("toggle", function () {

        var trigger = $('.toggle-container .trigger');

        var target = $('.toggle-container .target');

        var toggle = mote.run('Toggle', {
            trigger: trigger,
            target: target,
            hover: true,
            pinned: true
        });

        trigger.trigger('click');

        ok(toggle.visible, "isVisible in Class");
        ok(target.is(':visible'), "isVisible in Real");
    });

}