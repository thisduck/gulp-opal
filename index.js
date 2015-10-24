var through = require('through2');
var gutil = require('gulp-util');
var fs = require('fs');

var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-opal';

// Load Opal
const OPAL_VERSION = '0.6.2';
var Opal = {};
filedata = fs.readFileSync(__dirname + '/lib/' + OPAL_VERSION + '/opal.js','utf8');
eval(filedata);
filedata = fs.readFileSync(__dirname + '/lib/' + OPAL_VERSION + '/opal-parser.min.js','utf8');
eval(filedata);

function gulpOpal(opt) {
    var stream = through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }

        var sourceCode = file.contents.toString('utf8');
        var compiledSourceCode = Opal.compile(sourceCode);

        var dest = gutil.replaceExtension(file.path, '.js');
        file.path = dest;
        file.contents = new Buffer(compiledSourceCode);
        this.push(file);

        return callback();
    });

    return stream;
}

module.exports = gulpOpal;
