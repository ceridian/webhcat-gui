var fs = require('fs');
var path = require('path');

module.exports = {
	timeStamp: function(callback){ // outputs a string timestamp of a date  // yyyy-mm-dd hh:mm
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

	dateStamp: function(callback){
		var d = new Date();
		var yyyy = d.getFullYear().toString();
		u.getFullMonth(function(mm){
			u.getFullDate(function(dd){
				var str = yyyy+'-'+mm+'-'+dd;
				callback(str);
			});
		});
	},

	getFullMinutes: function(callback){
		var d = new Date();
		var num = d.getMinutes();
		var s = num.toString();
		if(num < 10){
			var str = '0'+s;
			callback(str);
		}else{
			callback(s);
		}
	},

	getFullMonth: function(callback){
		var d = new Date();
		var num = d.getMonth() + 1;
		var s = num.toString();
		if(num < 10){
			var str = '0'+s;
			callback(str);
		}else{
			callback(s);
		}
	},

	getFullHours: function(callback){
		var d = new Date();
		var num = d.getHours() + 1;
		var s = num.toString();
		if(num < 10){
			var str = '0'+s;
			callback(str);
		}else{
			callback(s);
		}
	},

	getFullDate: function(callback){
		var d = new Date();
		var num = d.getDate() + 1;
		var s = num.toString();
		if(num < 10){
			var str = '0'+s;
			callback(str);
		}else{
			callback(s);
		}
	},

	getPreviousDate: function(i, callback){
		var d = new Date(new Date().setDate(new Date().getDate()-i));
		callback(d);
	},

	log: function(log, callback){ // logs to file
		if(debugFlag == true){ console.log('util.js: log: '+log); }
		u.dateStamp(function(ds){
			u.timeStamp(function(ts){
				var info = ts+'\t'+log+'\n\r';
				var targ = path.join(__dirname,'../','logs', ds+'-log.txt');
				fs.appendFile(targ, info, function(err){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			});
		});
	},

	error: function(error, callback){ // logs to error file
		if(debugFlag == true){ console.log('util.js: error: '+error); }
		u.dateStamp(function(ds){
			u.timeStamp(function(ts){
				var info = ts+'\t'+error+'\n\r';
				var targ = path.join(__dirname,'../','logs', ds+'-error.txt');
				fs.appendFile(targ, info, function(err){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			});
		});
	}
}

var u = require('./util.js');
