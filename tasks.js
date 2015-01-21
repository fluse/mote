"use strict";
var inquirer = require("inquirer"),
    dirUtils = require("node-dirutils"),
    exec = require('child_process').exec;

module.exports = function (config) {

    console.dir(config);

    var path = (typeof config !== 'undefined' && config.hasOwnProperty('pathToMote')) ? config.pathToMote : './';

    /**
     *
     * @returns {Array}
     */
    var getFonts = function () {
        var fonts = [];

        var dirs = dirUtils.getDirs("../deliver/font");
        for (var dir = 0; dir < dirs.length; dir++) {
            var tmp = dirs[dir].split('/');
            fonts.push({
                name: tmp[tmp.length - 1],
                value: tmp[tmp.length - 1]
            });
        }

        return fonts;
    };

    var getPossableSprites = function () {
        var sprites = [];

        var dirs = dirUtils.getDirs("../deliver/sprite");
        for (var dir = 0; dir < dirs.length; dir++) {
            var tmp = dirs[dir].split('/');
            sprites.push({
                name: tmp[tmp.length - 1],
                value: tmp[tmp.length - 1]
            });
        }

        return sprites;
    };

    var getThemes = function () {
        var themes = [];

        var dirs = dirUtils.getDirs("../css/themes");
        for (var dir = 0; dir < dirs.length; dir++) {
            var tmp = dirs[dir].split('/');
            themes.push({
                name: tmp[tmp.length - 1],
                value: tmp[tmp.length - 1]
            });
        }

        return themes;
    };

    var getFileList = function (storage, files) {
        for (var file = 0; file < files.length; file++) {
            var part = files[file].split('.');
            if (part[1] === 'scss') {
                storage.push({
                    name: files[file],
                    value: files[file].replace("sass", "")
                });
            }
        }
        return storage;
    };

    var getPossableFiles = function () {
        var storage = [];

        storage.push(new inquirer.Separator('-- Base -----'));
        storage = getFileList(storage, dirUtils.getFiles("sass/src/base"));

        storage.push(new inquirer.Separator('-- Components -----'));
        storage = getFileList(storage, dirUtils.getFiles("sass/src/components"));

        storage.push(new inquirer.Separator('-- UI -----'));
        storage = getFileList(storage, dirUtils.getFiles("sass/src/ui"));

        storage.push(new inquirer.Separator('-- Vendor -----'));
        storage = getFileList(storage, dirUtils.getFiles("../css/vendor"));

        storage.push(new inquirer.Separator('-- Sprites -----'));
        storage = getFileList(storage, dirUtils.getFiles("../images/sprite"));

        return storage;
    };

    var questions = {
        install: {
            type: "confirm",
            name: "argument",
            message: "seriosly to create a new project?",
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please set a name"
            }
        },
        createTheme: {
            type: "input",
            name: "argument",
            message: "set the name of your theme",
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please set a name"
            }
        },
        compileTheme: {
            type: "list",
            name: "argument",
            message: "select an theme, that you want to compile",
            choices: getThemes(),
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please set a name"
            }
        },
        compileFont: {
            type: "list",
            name: "argument",
            message: "select an existing font from list",
            choices: getFonts(),
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please set a name"
            }
        },
        createFont: {
            type: "input",
            name: "argument",
            message: "set the name of your font",
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please set a name"
            }
        },
        createConcats: {
            type: "checkbox",
            name: "argument",
            message: "create concat from selected files",
            choices: getPossableFiles(),
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please select files"
            }
        },
        compileSprite: {
            type: "list",
            name: "argument",
            message: "create concat from selected files",
            choices: getPossableSprites(),
            validate: function( value ) {
                if (value.length > 0) {
                    return true;
                }
                return "please select a sprite folder"
            }
        }
    };

    var commandList = {
        install: "grunt mote",
        createTheme: "grunt theme -name=%name%",
        compileTheme: "grunt compile -name=%name%",
        compileFont: "grunt font -name=%name%",
        createFont: "grunt createFont -name=%name%",
        createConcat: "grunt concat -name=%name% -files=%files%",
        compileSprite: "grunt compileSprite -name=%name%"
    };


    inquirer.prompt({
        type: "list",
        name: "type",
        message: "select process?",
        choices: [
            new inquirer.Separator(),
            {
                key: 1,
                name: "First Install",
                checked: true,
                value: "install"
            },
            new inquirer.Separator('-- Theme -----'),
            {
                key: 2,
                name: "Create",
                value: "createTheme"
            },
            {
                key: 3,
                name: "Compile",
                value: "compileTheme"
            },
            new inquirer.Separator('-- Font -----'),
            {
                key: 4,
                name: "Compile",
                value: "compileFont"
            },
            {
                key: 5,
                name: "Create",
                value: "createFont"
            },
            new inquirer.Separator('-- Concats -----'),
            {
                key: 6,
                name: "Create Concat",
                value: "createConcats"
            },
            new inquirer.Separator('-- Sprites -----'),
            {
                key: 7,
                name: "Compile Sprite",
                value: "compileSprite"
            }
        ],
        validate: function( value ) {
           if (value.length > 0) {
               return true;
           }
           return "please select a option"
        }
    }, function( process ) {

        inquirer.prompt(questions[process.type], function( argument ) {

            if (!commandList.hasOwnProperty(process.type)) {
                console.log("process not found in commandList");
                return false;
            }

            var command = commandList[process.type].replace(/%name%/gi, argument.argument);

            exec(command, {
                cwd: path
            }, function(error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        });

    });
}