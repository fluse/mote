var fs = require("fs"),
    path = require("path"),
    clc = require('cli-color'),
    mkdirp = require('mkdirp'),
    extend = require('extend'),
    figures = require('figures');

module.exports = {
    grunt: null,
    cfg: null,

    initalize: function (grunt) {

        this.grunt = grunt;
        this.cfg = this.grunt.file.readJSON('package.json');

        this.cfg.dir.docroot = path.join(__dirname, '../../../');

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

        this.grunt.file.recurse(this.cfg.dir.docroot + this.cfg.dir.themes, function (abspath, rootdir, subdir, filename) {

            if (typeof subdir !== 'undefined' && (requestedTheme === false || requestedTheme === subdir)) {
                if (!themes.hasOwnProperty(subdir))
                    themes[subdir] = [];

                themes[subdir].push(filename);
            }

        });

        return themes;
    },

    /**
     *
     * @returns {Array}
     */
    getFonts: function () {
        var fonts = [];

        this.grunt.file.recurse(this.cfg.dir.docroot + this.cfg.dir.font, function (abspath, rootdir, subdir) {

            if (typeof subdir !== 'undefined') {
                fonts.push(subdir);
            }
        });

        return fonts;
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

            var currentTheme = themes[theme];

            this.updateCustomThemeWithNewSettings(currentTheme);

            this.buildConcats(currentTheme, concats);

        }

    },

    updateCustomThemeWithNewSettings: function (currentTheme) {
        // get theme settings and update with default
        for (var i = 0; i < currentTheme.length; i++) {

            var part = currentTheme[i].split('.');
            if (part[1] === 'json')
                this.theme[part[0]] = this.getCustomThemeByFile(currentTheme[i]);

        }
    },

    buildConcats: function (currentTheme, concats) {
        // iterate over concat files
        for (var a = 0; a < concats.length; a++) {

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

            // replace pathes
            content = content
                .replace(/%pathToSass%/gi, this.theme.dir.sass)
                .replace(/%pathToTheme%/gi, this.theme.dir.theme)
                .replace(/%pathToVendor%/gi, this.theme.dir.vendor)
                .replace(/%fontPath%/gi, this.theme.dir.font);

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
            sass: directoryLevel + '/mote/' + this.cfg.dir.sass,
            theme: directoryLevel + '/' + this.cfg.dir.themes + this.theme.name + '/',
            vendor: directoryLevel + '/' + this.cfg.dir.vendor,
            font: directoryLevel + '/' + this.cfg.dir.export.font
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
     */
    argumentCheck: function () {

        var checkList = {
            theme: {
                name: "default"
            }
        };

        for (var argument in checkList) {
            if (this.grunt.cli.tasks[0] === argument) {
                if (typeof grunt.option('argument') === 'undefined') {
                    console.log('no argument given ' + clc.red(argument));
                }
            }

        }

    },

    /**
     *
     * @param file
     * @param defaultSettings
     * @param customSettings
     * @returns {*}
     */
    updateThemeWithDefault: function (file, defaultSettings, customSettings) {

        var customSettings = extend ( true, defaultSettings, customSettings);

        fs.writeFile(this.cfg.dir.docroot + this.cfg.dir.themes + this.theme.name + '/' + file, JSON.stringify(customSettings, null, 4), function(err) {
            if(err) {
                console.log(clc.red(err));
                console.log();
            } else {
                console.log("JSON saved to " + customSettings);
            }
        });

        return customSettings;
    },

    /**
     *
     * @param file
     * @returns {*}
     */
    getDefaultThemeByFile: function (file) {
        return require(
            this.cfg.dir.docroot + 'mote/structure/' + this.cfg.dir.themes + 'default/' + file
        );
    }

};


Array.prototype.inArray = function (value) {
    var i;
    for (i = 0; i < this.length; i++)
        if (this[i] == value) return true;

    return false;
};
