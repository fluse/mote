/*
 * @autor      Holger Schauf
 * @brief      Load Required JS Files "related path"
 */

$LAB.script("../../../js/src/components/jquery.js").wait()
    .script("../../../js/src/components/handlebars-v2.0.0.js").wait()
    .script("../../../js/src/core/inheritance.js").wait()
    .script("../../../js/src/core/mote.js").wait()
    .script("../../../js/src/core/log.js").wait().wait(function () {

        $.getJSON( "../../../sass/themes/default/settings.json", function (data) {

            var source   = $("#template").html();
            console.log(data);
            var template = Handlebars.compile(source);
            $("body").append(template);

        }

    });