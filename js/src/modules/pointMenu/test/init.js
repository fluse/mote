/*
 * @autor      Holger Schauf
 * @brief      Load Required JS Files "related path"
 */

$LAB.script("../../../components/jquery.js").wait()
    .script("../../../core/inheritance.js").wait()
    .script("../../../core/mote.js").wait()
    .script("../../../core/log.js").wait()
    .script("../../../helper/windowCollision/windowCollision.js").wait()
    .script("../../../modules/pointMenu/pointMenu.js").wait(function () {

        var pointMenu = new mote.PointMenu({
        	triggerArea: $('body'),
        	tmplName: 'pointMenu'
        });

    });