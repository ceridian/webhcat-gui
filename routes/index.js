var express = require('express');
var router = express.Router();
var path = require('path');
var a = require('../lib/auth.js');

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

module.exports = router;
