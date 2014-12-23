var express = require('express');
var router = express.Router();
var path = require('path');
var l = require('../lib/lib.js');
var a = require('../lib/auth.js');

router.post('/', a.checkAuth, function(req, res) {
  var body = req.body;
  l.columns(body, function(err, conf){
    if(err){
      res.msg(err);
      res.send(500);
    }else{
      res.send(conf);
    }
  });
});

module.exports = router;
