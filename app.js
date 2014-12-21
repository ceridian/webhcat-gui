// modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var passport = require('passport');
//var localStrategy = require('passport-local').Strategy;

var a = require('./lib/auth.js');
var app = express();

// global

debugFlag = false;

// passport

// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });
//
// passport.deserializeUser(function(id, cb) {
//   findById(id, function (err, user) {
//     cb(err, user);
//   });
// });
//
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     process.nextTick(function () {
//       a.findByUser(username, function(err, user){
//         if (err) { return done(err); }
//         if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//         if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
//         return done(null, user);
//       });
//     });
//   }
// });


// settings
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'jfalajgiyiaog7a90g7a6gyaoyga7g0aygalyhga',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// routes
var index = require('./routes/index');
var hosts = require('./routes/hosts');
var hostStatus = require('./routes/hostStatus');
var statusDump = require('./routes/statusDump');
var login = require('./routes/login');
var dbs = require('./routes/dbs');

app.use('/', index);
app.use('/hosts', hosts);
app.use('/hostStatus', hostStatus);
app.use('/statusDump', statusDump);
app.use('/login', login);
app.use('/dbs', dbs);

// error handlers

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});

module.exports = app;
