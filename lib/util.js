var fs = require('fs');

module.exports = {
	dateStamp: function(callback){ // outputs a string timestamp of a date  // yyyy-mm-dd hh:mm
		var d = new Date();
		var yyyy = d.getFullYear().toString();
		u.getFullMonth(function(mm){
			u.getFullDate(function(dd){
				u.getFullHours(function(h){
					u.getFullMinutes(function(m){
						var str = yyyy+'-'+mm+'-'+dd+' '+h+':'+m;
						callback(str);
					});
				});
			});
		});
	},

	getFullMinutes: function(callback){
		var d = new Date();
		var num = d.getMinutes();
		var s = d.toString();
		if(num < 10){
			callback('0'+s);
		}else{
			callback(s);
		}
	},

	getFullMonth: function(callback){
		var d = new Date();
		var num = d.getMonth() + 1;
		var s = d.toString();
		if(num < 10){
			callback('0'+s);
		}else{
			callback(s);
		}
	},

	getFullHours: function(callback){
		var d = new Date();
		var num = d.getHours() + 1;
		var s = d.toString();
		if(num < 10){
			callback('0'+s);
		}else{
			callback(s);
		}
	},

	getFullDate: function(callback){
		var d = new Date();
		var num = d.getDate() + 1;
		var s = d.toString();
		if(num < 10){
			callback('0'+s);
		}else{
			callback(s);
		}
	},

	getPreviousDate: function(callback){
		calback(new Date(new Date().setDate(new Date().getDate()-i)));
	},

	log: function(log, callback){ // logs to file
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

	error: function(error, callback){ // logs to error file
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
