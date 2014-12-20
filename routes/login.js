var express = require('express');
var router = express.Router();
var models = require('../models');
var path = require('path');
var a = require('../lib/auth.js');

router.post('/', function(req, res) {
  var body = req.body;
  a.checkUser(body, function(err, obj){
    if(err){
      res.msg(err);
      res.send(500);
    }else{
      if(obj.status == 'ok'){
        req.session.user_id = obj.user;
        res.send(obj);
      }else{
        res.send(obj);
      }
    }
  })
});

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

module.exports = router;
