var fs = require('fs');

module.exports = {
	log: function(log, callback){
		if(debugFlag == true){ console.log('util.js: log: '+log); }
		var info = Date.datestamp()+'\t'+log+'\n\r';
		fs.appendFile('../logs/log.txt', info, function(err){
			if(err){
				callback(err);
			}else{
				callback(null);
			}
		});
	},

	error: function(error, callback){
		if(debugFlag == true){ console.log('util.js: error: '+error); }
		var info = Date.datestamp()+'\t'+error+'\n\r';
		fs.appendFile('../logs/error.txt', info, function(err){
			if(err){
				callback(err);
			}else{
				callback(null);
			}
		});
	}
}

var u = require('./util.js');
