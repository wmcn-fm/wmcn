var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sass = require('node-sass');

var mongo = require('mongoskin');

var dbUrl = require('./modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});
var collection = db.collection('usercollection');

var routes = require('./routes/index');
var users = require('./routes/users');

var admin = require('./routes/admin');
var applications = require('./routes/applications')
var dj = require('./routes/dj');
var show = require('./routes/show');
var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sass.middleware({
    src: path.join(__dirname, 'public/sass'),
    dest: path.join(__dirname, 'public'),
    debug: true
}));

// app.use(function(req,res,next){
//     req.db = db;
//     req.collection = collection
//     next();
// });



app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/apply', applications);
app.use('/dj', dj);
app.use('/show', show);
app.use('/test', test);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
