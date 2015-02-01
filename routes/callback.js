var express = require('express');
var router = express.Router();
var path = require('path');
var l = require('../lib/lib.js');
var i = require('../lib/io.js');

router.get('/:jobid', function(req, res) {
  var jobid = req.param('jobid');
  console.log(jobid, 'get: /callback/:jobid');
  i.alert('info', 'Job Completed', 'Hive Query', 'jobID: '+jobid);
  res.status(200).end();
});

router.post('/', function(req, res){
  var body = req.body;
  var query = body.str;
  console.log(body);
  l.hiveQuery(query, function(err, conf){
    if(err){
      res.msg(err);
      res.status(500).end();
    }else{
      res.send(conf);
    }
  });
});

module.exports = router;
