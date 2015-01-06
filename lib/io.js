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

  alert: function(msg, type){
    console.log('alert: '+msg);
    var obj = {type: type, msg: msg};
    io.emit('alert', obj);
  }
}
