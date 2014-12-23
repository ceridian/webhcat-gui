// modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var a = require('./lib/auth.js');
var app = express();

// global

debugFlag = false;

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
var tables = require('./routes/tables');
var configs = require('./routes/configs');
var users = require('./routes/users');
var columns = require('./routes/columns');

app.use('/', index);
app.use('/hosts', hosts);
app.use('/hostStatus', hostStatus);
app.use('/statusDump', statusDump);
app.use('/login', login);
app.use('/dbs', dbs);
app.use('/tables', tables);
app.use('/configs', configs);
app.use('/users', users);
app.use('/columns', columns);

app.get('/404', function(req, res, next){
  next();
});

// 404

app.use(function(req, res, next){
  res.redirect('/');
});

// error handlers

app.use(function(err, req, res, next) {
  if(err){
  	res.status(err.status || 500);
  	res.send(err);
  }else{
    res.redirect('/');
  }
});

module.exports = app;
