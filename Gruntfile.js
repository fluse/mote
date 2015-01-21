var fs = require("fs"),
    path = require("path"),
    clc = require('cli-color'),
    mkdirp = require('mkdirp'),
    extend = require('extend'),
    figures = require('figures');

module.exports = function (grunt) {

    'use strict';

    //var buildWorkFlow = require('./grunt/scripts/buildWorkflow.js');

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    buildWorkFlow.initalize(grunt);

    grunt.initConfig({
        pkg: buildWorkFlow.cfg,
        sass: {
            options: {
                require: ['sass-json-vars'],
                style: "nested"
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.tmp,
                    src: ['**/**/*.scss'],
                    dest: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.css,
                    ext: '.css'
                }]
            }
        },
        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['compile']
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: '/* <%= pkg.name %>.<%= pkg.version %>.css - <%= pkg.copyright %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                    report: 'gzip'
                },
                files: [{
                    expand: true,
                    cwd: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.css,
                    src: ['**/*.css'],
                    dest: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.css,
                    ext: '.min.css'
                }]
            }
        },
        svgmin: {
            multiple: {
                files: [{
                    expand: true,
                    cwd: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.deliverFont,
                    src: ['**/*.svg'],
                    dest: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.font
                }]
            }
        },
        clean: {
            options: { force: true },
            compile: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.tmp,
            css: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.css + (grunt.option('name') || ""),
            font: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.font + grunt.option('name') + "/*.scss"
        },
        tinypng: {
            options: {
                apiKey: "QcVXKzYlf7HyIVzBTxfq2BjagV6dzoPQ",
                checkSigs: false,
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },
            sprite: {
                src: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.sprite + grunt.option('name') + '.png',
                dest: '/',
                expand: true,
                ext: '.min.png'
            }
        },
        sprite: {
            all: {
                'imgPath': '%pathToSprite%' + grunt.option('name') + '.min.png',
                'algorithm': 'binary-tree',
                'padding': 1,
                'cssOpts': {
                    'cssClass': function (item) {
                        return '.spr-' + item.name;
                    }
                },
                src: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.deliverSprite + grunt.option('name') + '/*.png',
                destImg: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.sprite + grunt.option('name') + '.png',
                destCSS: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.export.sprite + grunt.option('name') + '.css'
            }
        },
        copy: {
            structure: {
                expand: true,
                cwd: "export/",
                src: ['**/*'],
                dest: buildWorkFlow.cfg.dir.docroot
            },
            main: {
                expand: true,
                cwd: "export/css/themes/default/",
                src: ['**/*'],
                dest: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.themes + grunt.option('name') + '/'
            },
            font: {
                expand: true,
                cwd: "export/deliver/font/default/",
                src: ['*'],
                dest: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.deliverFont + grunt.option('name') + '/'
            },
            cssAsScss: {
                files: [
                    {
                        expand: true,
                        cwd: buildWorkFlow.cfg.dir.docroot + 'font/',
                        src: ['**/*.css'],
                        dest: buildWorkFlow.cfg.dir.docroot + 'font/',
                        filter: 'isFile',
                        ext: ".scss"
                    }
                ]
            }
        },
        webfont: {
            icons: {
                src: buildWorkFlow.cfg.dir.docroot + buildWorkFlow.cfg.dir.deliver +'/font/' + grunt.option('name') + '/*.svg',
                dest: buildWorkFlow.cfg.dir.docroot + 'font/' + grunt.option('name') + '/',
                options: {
                    engine: 'node',
                    hashes: true,
                    ie7: true,
                    font: grunt.option('name'),
                    templateOptions: {
                        template: 'export/font/template.scss'
                    }
                }
            }
        }
    });

    buildWorkFlow.createTasks();

};

var buildWorkFlow = {
    grunt: null,
    cfg: null,

    initalize: function (grunt) {

        this.grunt = grunt;
        this.cfg = this.grunt.file.readJSON('package.json');

        this.cfg.dir.docroot = path.join(__dirname, '../');

        /*
         * CSS Compile PreFlows
         */
        if (this.cli() && this.grunt.cli.tasks.inArray('compile')) {
            mkdirp(this.cfg.dir.docroot + this.cfg.dir.tmp);
            this.writeThemeBasedConcats();
        }

    },

    /**
     * grunt cli feedback
     * @returns {boolean}
     */
    cli: function () {
        console.log(clc.cyan(figures.bullet + ' run task ' + this.grunt.cli.tasks));

        this.prioTheme = (typeof this.grunt.option('theme') === 'undefined') ? false : this.grunt.option('theme');

        if (this.grunt.cli.tasks.inArray('help')) {
            for (var tasks in this.cfg.tasks) {
                if (tasks === 'clear') {
                    console.log(clc.magenta.bold(tasks) + ': ' + this.cfg.tasks[tasks].description + ' ' + this.cfg.clear.join('; '));
                } else {
                    console.log(clc.magenta.bold(tasks) + ': ' + this.cfg.tasks[tasks].description);
                }
                if (this.cfg.tasks[tasks].hasOwnProperty('arguments')) {
                    for (var argument in this.cfg.tasks[tasks].arguments) {
                        console.log(argument + ': ' + this.cfg.tasks[tasks].arguments[argument]);
                    }
                }
            }
            return false;
        }
        return true;
    },

    /**
     * create tasks from package.json
     */
    createTasks: function () {
        for (var tasks in this.cfg.tasks)
            this.grunt.registerTask(tasks, this.cfg.tasks[tasks].components);
    },

    /**
     *
     * @returns {Array}
     */
    getThemes: function () {

        var themes = {};

        var requestedTheme = this.grunt.option('name') || false;

        if (requestedTheme !== false)
            console.log(clc.green(figures.bullet) + " get themes " + requestedTheme);

        this.grunt.file.recurse(this.cfg.dir.docroot + this.cfg.dir.themes, function (abspath, rootdir, subdir, filename) {

            if (typeof subdir !== 'undefined' && (requestedTheme === false || requestedTheme === subdir)) {
                if (!themes.hasOwnProperty(subdir))
                    themes[subdir] = [];

                themes[subdir].push(filename);
            }

        });

        console.log(clc.green(figures.tick) + " get themes");

        return themes;
    },

    /**
     *
     * @returns {Array}
     */
    getConcats: function () {
        var concats = [];

        this.grunt.file.recurse(this.cfg.dir.docroot + this.cfg.dir.concats, function (abspath, rootdir, subdir, filename) {

            subdir = (typeof subdir !== 'undefined') ? subdir + "/" : '';

            var name = filename.substr(0, filename.lastIndexOf('.'));
            if (name.length > 0) {
                concats.push({
                    name: filename.substr(0, filename.lastIndexOf('.')),
                    path: subdir,
                    full: abspath
                });
            }

        });

        return concats;
    },

    writeThemeBasedConcats: function () {

        var themes = this.getThemes();

        var concats = this.getConcats();

        // iterate over theme length
        for (var theme in themes) {

            this.theme = this.buildThemeObject(theme);

            console.log(clc.yellow(figures.pointer) + " configure theme: " + this.theme.name);

            var currentTheme = themes[theme];

            this.updateCustomThemeWithNewSettings(currentTheme);

            this.buildConcats(currentTheme, concats);

        }

    },

    updateCustomThemeWithNewSettings: function (currentTheme) {
        // get theme settings and update with default
        for (var i = 0; i < currentTheme.length; i++) {

            var part = currentTheme[i].split('.');
            if (part[1] === 'json') {
                console.log(" " + clc.yellow(figures.pointer) + " get " + currentTheme[i]);
                this.theme[part[0]] = this.getCustomThemeByFile(currentTheme[i]);
            }

        }
    },

    buildConcats: function (currentTheme, concats) {
        // iterate over concat files
        for (var a = 0; a < concats.length; a++) {

            console.log(clc.yellow(figures.pointer) + " build concat: " + concats[a].name);

            this.theme.dir = this.writeConcatBasedPathes(concats[a]);

            var content = '';

            // create concat structure
            if (concats[a].path !== '/')
                mkdirp.sync(this.theme.dir.tmp + concats[a].path);

            // set mixin
            content += this.cfg.sass.master;

            // generate merge file list
            for (var i = 0; i < currentTheme.length; i++)
                content += '@import "' + this.theme.dir.theme + currentTheme[i] + '";';

            // merge concat files
            content += this.getContentOfFiles([concats[a].full]);

            // write font
            if (content.search("font") !== -1)
                content += this.getFonts();

            content += this.getSprites();

            // replace pathes
            content = content
                .replace(/%pathToSass%/gi, this.theme.dir.sass)
                .replace(/%pathToTheme%/gi, this.theme.dir.theme)
                .replace(/%pathToVendor%/gi, this.theme.dir.vendor)
                .replace(/%pathToSprite%/gi, '../' + this.theme.dir.sprite)
                .replace(/%fontPath%/gi, '../' + this.theme.dir.font);

            // create compile file
            fs.writeFileSync(
                this.theme.dir.tmp + concats[a].path + concats[a].name + '.scss',
                content
            );

        }
    },

    /**
     *
     * @param theme
     * @returns {{name: *}}
     */
    buildThemeObject: function (theme) {
        return {
            name: theme
        };
    },

    /**
     *
     * @param concatFile
     * @returns {{tmp: string, sass: string, theme: string, vendor: string, font: string}}
     */
    writeConcatBasedPathes: function (concatFile) {
        var directoryLevel = this.createPath(concatFile.path);

        // build Theme Object
        return {
            tmp: this.cfg.dir.docroot + this.cfg.dir.tmp + this.theme.name + '/',
            sass: directoryLevel + '/mote-css/' + this.cfg.dir.sass,
            theme: directoryLevel + '/' + this.cfg.dir.themes + this.theme.name + '/',
            vendor: directoryLevel + '/' + this.cfg.dir.vendor,
            font: directoryLevel + '/' + this.cfg.dir.export.font,
            sprite: directoryLevel + '/' + this.cfg.dir.export.sprite
        }
    },

    /**
     *
     * @returns {string}
     */
    getFonts: function () {

        var fontImports = '';

        if (this.theme.settings.hasOwnProperty('icon-font-list')) {

            var fontList = this.theme.settings['icon-font-list'];

            for (var i = 0; i < fontList.length; i++) {

                try {
                    fontImports += fs.readFileSync(
                        this.cfg.dir.docroot + this.cfg.dir.export.font + fontList[i] + '/' + fontList[i] + '.scss'
                    ).toString();

                    console.log(clc.green(figures.tick) + " get fonts " + fontList[i]);
                } catch (e) {
                    console.log(clc.red('font: ' + fontList[i] + ' not found; do: grunt font -name=' + fontList[i]));
                }
            }

            fontImports = fontImports.replace(/%className%/gi, this.theme.settings['icon-name']);

            return fontImports;

        } else {
            console.log(clc.red('icon-font-list not found in: ') + this.theme.name);
            return "";
        }

    },

    getSprites: function () {
        // @todo sprite will be included twice
        var spriteImports = '';

        if (this.theme.settings.hasOwnProperty('sprite-list')) {
            var list = this.theme.settings['sprite-list'];
            for (var spriteName in list) {

                try {
                    spriteImports += fs.readFileSync(
                        this.cfg.dir.docroot + this.cfg.dir.export.sprite + spriteName + '.css'
                    ).toString();

                    console.log(clc.green(figures.tick) + " get sprite " + spriteName);
                } catch (e) {
                    console.log(clc.red(figures.cross) + " no font" + spriteName);
                }
            }
        }

        return spriteImports;

    },

    /**
     *
     * @returns {Function|settings|*}
     */
    getCustomThemeByFile: function (file) {

        var defaultTheme = this.getDefaultThemeByFile(file);

        var customTheme = require(
            this.cfg.dir.docroot + this.cfg.dir.themes + this.theme.name + '/' + file
        );

        return this.updateThemeWithDefault(file, defaultTheme, customTheme);
    },

    /**
     *
     * @param list
     * @returns {string}
     */
    getContentOfFiles: function (list) {
        var out = list.map(function (filePath) {
            return fs.readFileSync(filePath).toString();
        });

        return out.join('\n');
    },

    /**
     *
     * @param path
     * @returns {string}
     */
    createPath: function (path) {
        var pathDeep = path.split('/'),
            directories = "..";

        for (var i = 0; i < pathDeep.length; i++) directories += "/..";

        return directories;
    },

    /**
     *
     * @param file
     * @param defaultSettings
     * @param customSettings
     * @returns {*}
     */
    updateThemeWithDefault: function (file, defaultSettings, customSettings) {

        console.log(" " + clc.green(figures.tick) + " " + file + " updated");

        if (defaultSettings.version <= customSettings.version) {
            console.log(clc.green("settings up to date with version" + customSettings.version));
            return customSettings;
        }

        var newCustomSettings = extend(true, defaultSettings, customSettings);

        // set to new version
        customSettings.version = defaultSettings.version;

        if (typeof newCustomSettings !== 'undefined') {
            fs.writeFile(this.cfg.dir.docroot + this.cfg.dir.themes + this.theme.name + '/' + file, JSON.stringify(newCustomSettings, null, 4), function(err) {
                if(err) {
                    console.log(" " + clc.red(figures.cross) + " " + file + " error: " + err);
                    fs.writeFile(this.cfg.dir.docroot + this.cfg.dir.themes + this.theme.name + '/' + file, JSON.stringify(customSettings, null, 4));
                } else {
                    console.log(" " + clc.green(figures.tick) + " " + file + " theme updated");
                }
            });
        }

        console.log(clc.green("settings upgradet to new version version" + customSettings.version));

        return customSettings;
    },

    /**
     *
     * @param file
     * @returns {*}
     */
    getDefaultThemeByFile: function (file) {

        return require(
            this.cfg.dir.docroot + 'mote-css/export/' + this.cfg.dir.themes + 'default/' + file
        );
    }

};


Array.prototype.inArray = function (value) {
    var i;
    for (i = 0; i < this.length; i++)
        if (this[i] == value) return true;

    return false;
};