/*
 * @autor      Holger Schauf
 * @brief      Load Required JS Files "related path"
 */

$LAB.script("bigFat.js")
    .script("bigFun.js")
    .script("picBig.js")
    .script("biggiBig").wait(function () {
        ready();
    });