<h1><code>gulp-mtime-correction</code></h1>


<p>A <a href="https://gulpjs.com/">Gulp</a> plugin to temporarily adjust file last modification time (mtime) for pushing files to servers in different timezones.</p>

<p>This plugin works as a nice extension to <a href="https://www.npmjs.com/package/gulp-newer">gulp-newer</a>.</p>

<h2>Install</h2>

<code>npm install gulp-mtime-correction --save-dev</code>

<h2>Examples</h2>

<h3>Pushing files via FTP to a server in another timezone</h3>

<p><strong>Eg: A server is 5 hours ahead of us: </strong></p>
<p>(See <a href="https://www.npmjs.com/package/vinyl-ftp">vinyl-ftp</a> for ftp deployment task)</p>

```
// task to move timezone of build folder files forward to match live server
gulp.task('tz:forward', () => {

    gutil.log('Moving build folder forward');

    return gulp.src(dir.build + '/**/*')
    .pipe(mtime(5))
    .pipe(gulp.dest(dir.build));
});


// task to move timezone of build folder files back to local time
gulp.task('tz:back', () => {

    gutil.log('Moving build folder back');

    return gulp.src(dir.build + '/**/*')
    .pipe(mtime(-5))
    .pipe(gulp.dest(dir.build));
});


// task for ftp deployment of only newer files
gulp.task( 'deploy', () => {

    var conn = ftp.create( FTP.connOpts );

    // turn off buffering in gulp.src for best performance 
    return gulp.src( FTP.src , { base: FTP.base, buffer: false } )
        .pipe( conn.newer( FTP.directoryPath ) ) // only upload newer files 
        .pipe( conn.dest( FTP.directoryPath ) );
} );



// ftp deployment allowing for timezone difference
// file mtimes are moved in sequence before and after the deployment

gulp.task( 'ftp', gulpSequence('tz:forward','deploy','tz:back'));
```

<p><a href="https://www.npmjs.com/package/gulp-newer">gulp-newer</a> works perfectly if you want to push only newer files via FTP to a server in the same timezone. It finds which local files have been updated since your last push by comparing their mtimes (time of last modification). It then pushes only those files, saving you a lot of time.</p>

<p><strong>But what happens if your server's timezone is 5 hours ahead?</strong> This could happen often if you are, for example, a remote worker with clients spread around the world.</p>

</p>If the server's files are ahead of us, then by comparing mtimes <a href="https://www.npmjs.com/package/gulp-newer">gulp-newer</a> concludes that the server's files were updated more recently, and thus won't push our modified files unless we wait out the timezone gap</p>

<p>If the server is behind us, the opposite happens. All our files appear newer than they are and too many get pushed, meaning time wasted for us waiting for them to upload</p>

<p>By moving the mtime of all our files ahead, or back, <a href="https://www.npmjs.com/package/gulp-newer">gulp-newer</a> can now accurately compare the mtimes and push only newer files.</p>

<p>Let me know if you can think of more uses for it!</p>
