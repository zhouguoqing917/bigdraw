var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var cssmin = require('gulp-clean-css'),
    uglify = require('gulp-uglify');
// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');
var iconv = require('gulp-iconv');
var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;
var dataString = function() {
        var dt = new Date();
        var dm = String((dt.getMonth() + 1) >= 12 ? 12 : (dt.getMonth() + 1));
        if (dm.length < 2) {
            dm = '0' + dm;
        }
        var dd = String(dt.getDate());
        if (dd.length < 2) {
            dd = '0' + dd;
        }
        var dh = String(dt.getHours());
        if (dh.length < 2) {
            dh = '0' + dh;
        }
        var dmi = String(dt.getMinutes());
        if (dmi.length < 2) {
            dmi = '0' + dmi;
        }
        var dse = String(dt.getSeconds());
        if (dse.length < 2) {
            dse = '0' + dse;
        }
        var dtstr = " " + dt.getFullYear() + '' + dm + '' + dd + ' ' + dh + ':' + dmi + ':' + dse;
        return dtstr;
    };
var opts={};
opts.date=dataString();
var comment = '/*!\n' +  ' date:'+opts.date+ '\n'+ '*/\n';
var auto_pixer = ['last 2 versions', 'Android > 4.0', 'iOS > 6', 'Firefox >= 32', 'Chrome >= 32', 'ie >= 8',
    'ExplorerMobile > 9', '> 1%'
];

var jsmincfg = {
    options: {
        banner: '/* date: ' + opts.date + ', sohutv inc. */\n'
    },
    mangle: {
        toplevel: true,
        except: ['Zepto', 'jQuery', 'Backbone','Bone', 'seajs', 'define', 'require', 'module', 'exports']
    },
    fromString: true,
    compress: true
};

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});
//2.压缩
gulp.task('min:js', function() {
    return gulp.src([
            dirs.dist + '/js/**/*.js'
        ] )
        .pipe(uglify(jsmincfg))
        .pipe(gulp.dest(dirs.dist + '/js/'))
});

gulp.task('min:css', function() {
    return gulp.src([
            opts.dist + '/css/**/*.css'
        ] )
        .pipe(cssmin())
        .pipe(gulp.dest(opts.dist + '/css/'))
});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    'copy:misc'
]);

gulp.task('copy:misc', function () {
    return gulp.src([
        dirs.src + '/**/*' ])
	.pipe(gulp.dest(dirs.dist));
});


gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('build', function (done) {
    runSequence(  ['clean'], 'copy','min:css','min:js','iconv', done);
});

gulp.task('default', ['build']);
