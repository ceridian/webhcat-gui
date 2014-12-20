var express = require('express');
var router = express.Router();
var path = require('path');
var l = require('../lib/lib.js');

router.get('/', function(req, res) {
  l.statusDump(function(err, conf){
    if(err){
      res.msg(err);
      res.send(500);
    }else{
      res.send(conf);
    }
  });
});

module.exports = router;
