var express = require('express');
var router = express.Router();
var path = require('path');
var l = require('../lib/lib.js');
var a = require('../lib/auth.js');

router.get('/', a.checkAuth, function(req, res) {
  l.configs(function(err, conf){
    if(err){
      res.msg(err);
      res.send(500);
    }else{
      res.send(conf);
    }
  });
});

module.exports = router;
