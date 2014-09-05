var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sass = require('node-sass');

var mongo = require('mongoskin');

var dbUrl = require('./dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var collection = db.collection('usercollection');

var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

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

app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(sass.middleware({
    src: __dirname + '/public' + '/sass',
    dest: path.join(__dirname + '/public'),
    debug: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    secret: 'Should definitely change this and store somewhere Will.', // session secret
    saveUninitialized: true,
    resave: true })); 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// app.use(function(req,res,next){
//     req.db = db;
//     req.collection = collection
//     next();
// });

//this configures passport so all the routes can use it
//we export config_passport as an function that takes the passport obj as argument
require('./config_passport.js')(passport)

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

// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

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
