var fs = require('fs');
var path = require('path');
var async = require('async');
var i = require('./io.js');
var models = require('../models');

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

	log: function(type, alertName, from, desc, callback){ // logs to file
		if(debugFlag == true){ console.log('util.js: log: '+log); }
		u.dateStamp(function(ds){
			u.timeStamp(function(ts){
				u.addAlert(type, alertName, from, desc, function(){
					var info = ts+'\t'+type+'\t'+alertName+'\t'+from+'\t'+desc+'\n\r';
					var targ = path.join(__dirname,'../','logs', ds+'-log.txt');
					if(type)
					fs.appendFile(targ, info, function(err){
						if(err){
							callback(err);
						}else{
							i.alert(type, alertName, from, desc);
							callback();
						}
					});
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
	},

	localIP: function(callback){
		var os = require('os');
		var ifaces = os.networkInterfaces();
		var keys = Object.keys(ifaces);
		var hold = [];
		async.each(keys, function(i, cb){
			var iface = ifaces[i];
			async.each(iface, function(v, cb2){
				if('IPv4' !== v.family || v.internal !== false){
					cb2();
				}else{
					hold.push(v.address);
					cb2();
				}
			}, function(){
				cb();
			});
		}, function(){
			callback(hold[0]);
		});
	},
	// type: { type: DataTypes.STRING, allowNull: false },
	// alertName: { type: DataTypes.STRING, allowNull: false },
	// from: { type: DataTypes.STRING, allowNull: false },
	// description: DataTypes.STRING,
	// ackBy: DataTypes.STRING,
	// ackTime: DataTypes.DATE
	addAlert: function(type, msg, from, desc, callback){
		var obj = {};
		obj.type = type;
		obj.alertName = msg;
		obj.from = from;
		obj.description = desc;
		models.ALERT.create(obj).complete(function(err){
			if(err){
				u.error(err, function(er){
					callback(er);
				});
			}else{
				callback();
			}
		});
	},

	ackAlert: function(){

	}
}

var u = require('./util.js');
