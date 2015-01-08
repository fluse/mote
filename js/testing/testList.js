/*
 * Load Required JS Files "related path"
 */
$LAB.script("qunit.js").wait()
    .script("../core/test/mote.js").wait()
    .script("../core/test/log.js").wait()
    .script("../modules/layer/test/layer.js").wait()
    .script("../helper/toggle/test/toggle.js").wait()
    .script("../modules/dice/test/dice.js").wait();