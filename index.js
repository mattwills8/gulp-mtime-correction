

const
      
    // Gulp and plugins
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    fs            = require('fs'),
    through       = require('through2')
;

var 

    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'gulp-mtime-correction'
;




module.exports = (correction) => {
    
    if (! (correction || correction === 0) ) {
        throw new PluginError(PLUGIN_NAME, 'Requires a time zone correction in hours to be passed');
    }
    
    if (typeof correction !== 'number') {
        throw new PluginError(PLUGIN_NAME, 'Requires time zone correction to be an integer');
    }
        
    return through.obj(function(file, encoding, callback) {
      
        callback(null, setMtime(file.path, correction));
      
    });
}



function setMtime(path, correction) {
    
    // get file stats
    fs.stat(path, (err, stats) => {
        if (err) throw err;
       
        // get mtime of file and make correction
        var mtime = new Date(stats.mtimeMs);
        mtime.setHours(mtime.getHours() + correction);

        // put atime and mtime in seconds for passing to fs.utimes
        var mtimeSeconds = (mtime.getTime())/1000;
        var atimeSeconds = (stats.atimeMs)/1000;
       
        // commit the change to file stats
        fs.utimes(path, atimeSeconds, mtimeSeconds, (err) => {
            if (err) throw err;
        });  
   });
}

function getMtimeMs(path, callback) {

    fs.stat(path, (err, stats) => {
        if (err) throw err;
       
        gutil.log(stats.mtimeMs);  
        
        callback(stats.mtimeMs);
    });
}
