var express = require('express');
var router = express.Router();
var path = require('path');
var l = require('../lib/lib.js');
var a = require('../lib/auth.js');

router.post('/', a.checkAuth, function(req, res) {
  var id = req.body.id;
  l.jobDetail(id, function(err, conf){
    if(err){
      res.msg(err);
      res.send(500);
    }else{
      res.send(conf);
    }
  });
});

module.exports = router;
