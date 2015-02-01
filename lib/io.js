var async = require('async');
var models = require('../models');
var u = require('./util.js');
var request = require('request');
var l = require('./lib.js');

module.exports = {
  dump: function(){
    if(sock){
      console.log('dump');
    }
  },

  alert: function(type, alertName, from, desc){
    console.log(type, alertName, from, desc);
    var obj = {};
    obj.type = type;
    obj.alertName = alertName;
    obj.from = from;
    obj.description = desc;
    console.log(obj);
    io.emit('alert', obj);
  }
}
