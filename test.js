var u = require('./lib/util.js');
var l = require('./lib/lib.js');
var models = require('./models');
var async = require('async');
//var a = require('./lib/auth.js');
var request = require('request');


var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

debugFlag = 'true';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/callback/:jobid', function(req, res){
  var jobid = req.param('jobid');
  console.log(jobid, 'get: /callback/:jobid');
  res.send(200);
});

// function start(){
//   l.configs(function(err, res){
//     console.log(err, res.webhcat_host.value.current.ipAddr);
//   });
// }

function start(){
  // l.configs(function(err, conf){
  //   var targ = conf.webhcat_host.value.current.ipAddr;
  //   var port = conf.webhcat_port.value;
  //   var user = conf.query_user.value;
  //   var cmd = "http://"+targ+":"+port+"/templeton/v1/hive";
  //   request({
  //     method: 'POST',
  //     url: cmd,
  //     form: {
  //       'user.name': 'hdfs',
  //       'execute': "SELECT COUNT(*) FROM testting.people",
  //       'statusdir': "testting.people",
  //       'callback': "http://192.168.1.106:3000/callback/$jobId",
  //     }
  //   }, function(err, response, body){
  //     if(err){
  //       console.log(err, null);
  //     }else{
  //       var parsed = JSON.parse(body);
  //       console.log(parsed);
  //     }
  //   });
  // })
  // var os = require('os');
  // var ifaces = os.networkInterfaces();
  // Object.keys(ifaces).forEach(function (ifname) {
  //   ifaces[ifname].forEach(function (iface) {
  //     if ('IPv4' !== iface.family || iface.internal !== false) {
  //       return;
  //     }else{
  //       console.log(iface);
  //     }
  //   });
  // });
  u.localIP(function(ip){
    console.log(ip);
  });
}
start();


//app.listen(3000);
