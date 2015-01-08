/*
 * Load Required JS Files "related path"
 */
$LAB.script("../mote/components/jquery.js").wait()
    .script("../mote/components/jquery.tpml.js").wait()
    .script("../mote/core/inheritance.js").wait()
    .script("../mote/core/mote.js").wait()
    .script("../mote/core/log.js").wait()
    .script("../mote/modules/move/move.js")
    .script("../mote/modules/move/day.js").wait(function () {



        var myMove = new mote.Move();

    });