// modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// routes
var index = require('./routes/index');
var hosts = require('./routes/hosts');
var hostStatus = require('./routes/hostStatus');
var statusDump = require('./routes/statusDump');
var login = require('./routes/login');

app.use('/', index);
app.use('/hosts', hosts);
app.use('/hostStatus', hostStatus);
app.use('/statusDump', statusDump);
app.use('/login', login);

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

// error handlers

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err);
});

module.exports = app;
