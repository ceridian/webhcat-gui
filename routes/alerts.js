var express = require('express');
var router = express.Router();
var path = require('path');
var l = require('../lib/lib.js');
var a = require('../lib/auth.js');

router.get('/', a.checkAuth, function(req, res) {
  // l.dbs(function(err, conf){
  //   if(err){
  //     console.log(err);
  //     res.status(500).end();
  //   }else{
  //     res.send(conf);
  //   }
  // });
});

module.exports = router;
