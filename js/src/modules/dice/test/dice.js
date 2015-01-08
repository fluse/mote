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
    .script("../modules/dice/dice.js")
    .wait(startDiceTest);


function startDiceTest() {

    module("dice");

    test("app", function () {
        var app = mote.run('Dice');

        strictEqual(typeof app === 'object', true, 'check app is object');
    });

    test("roll", function () {

        var dice = mote.run('Dice', {
            max: 10
        });

        var number = dice.roll();
        ok(
            number > 0,
            "dice throw number"
        );

        ok(
            dice.history.length > 0,
            "dice throw was saved in array"
        );

        dice.history = [];

        var rounds = 1000,
            status = true;
        for (var i = 0; i < rounds; i++) {
            number = dice.roll();

            if (number > 11 && number < 0)
                status = false;
        }

        ok(
            status,
            "dice number inside range after " + rounds + " Tests"
        );

        ok(
            dice.history.length === rounds,
            rounds + " Tests was saved into array"
        );

        number = dice.roll();

        ok(
            number === dice.last(),
            "get last is right number"
        );

    });

}