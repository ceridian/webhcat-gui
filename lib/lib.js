var exec = require('child_process').exec;
var async = require('async');
var models = require('../models');

module.exports = {
	configs: function(callback){
		models.CONFIG.findAll().complete(function(err, result){
			if(err){
				if(debugFlag == true){ console.log('lib.js: configs: first db query fail: '+err); }
				callback(err, null);
			}else{
				l.hosts(function(err, hosts){
					if(err){
						if(debugFlag == true){ console.log('lib.js: configs: hosts() call: '+err); }
						callback(err, null);
					}else{
						var hold = {};
						async.each(result, function(r, cb){
							var obj = {};
							var key = r.key;
							obj.id = r.id;
							obj.key = key;
							obj.value = r.value;
							obj.createdAt = r.createdAt;
							obj.updatedAt = r.updatedAt;
							if(debugFlag == true){ console.log('lib.js: configs: key: '+key); }
							var index = key.indexOf('_host');
							if(debugFlag == true){ console.log('lib.js: configs: index: '+index); }
							if(index > 0){
								models.HOST.find({where: {id: obj.value}}).complete(function(err, h){
									if(err){
										if(debugFlag == true){ console.log('lib.js: configs: second db call fail: '+err); }
										cb(err);
									}else{
										var sub = {};
										sub.id = h.id;
										sub.ipAddr = h.ipAddr;
										sub.hostName = h.hostName;
										sub.createdAt = h.createdAt;
										sub.updatedAt = h.updatedAt;
										if(debugFlag == true){ console.log('lib.js: configs: index > 0: sub: '+JSON.stringify(sub)); }
										var subObj = {};
										subObj.current = sub;
										subObj.options = hosts;
										obj.value = subObj;
										hold[key] = obj;
										cb();
									}
								});
							}else{
								if(debugFlag == true){ console.log('lib.js: configs: obj: right befor adding to hold: '+JSON.stringify(obj)); }
								hold[key] = obj;
								cb();
							}
						}, function(err){
							if(err){
								if(debugFlag == true){ console.log('lib.js: configs: callback: if err: '+err); }
								callback(err, null);
							}else{
								if(debugFlag == true){ console.log('lib.js: configs: callback: no error: '+JSON.stringify(hold)); }
								callback(null, hold);
							}
						});
					}
				});
			}
		});
	},

	hosts: function(callback){
		models.HOST.findAll().complete(function(err, conf){
			if(err){
				if(debugFlag == true){ console.log('lib.js: hosts: db query: '+err); }
				callback(err, null);
			}else{
				async.map(conf, function(h, cb){
					var obj = {};
					obj.id = h.id;
					obj.ipAddr = h.ipAddr;
					obj.hostName = h.hostName;
					obj.createdAt = h.createdAt;
					obj.updatedAt = h.updatedAt;
					cb(null, obj);
				}, function(err, done){
					if(err){
						callback(err, null);
					}else{
						callback(null, done);
					}
				});
			}
		});
	},

	ping: function(targ, callback){
		if(debugFlag == true){ console.log('ping: targ: '+targ); }
		exec('ping '+targ, function(err, stdout, stderr){
			if(err) {
				if(debugFlag == true){ console.log('lib.js: ping: exec error: '+err); }
				callback(err, null);
			}else{
				if(debugFlag == true){ console.log('ping: stdout: '+stdout); }
				var lines = stdout.split('\n');
				if(debugFlag == true){ console.log('ping: lines: '+lines); }
				var i = 0;
				var times = 0;
				async.eachSeries(lines, function(l, cb){
					if(i > 1){
						if(i < 6){
							if(debugFlag == true){ console.log('ping: loop: l: '+i, l); }
							var cut = l.split(' ');
							var t1 = cut[4];
							var t2 = cut[3];
							if(debugFlag == true){ console.log('ping: t1: '+t1); }
							if(debugFlag == true){ console.log('ping: t2: '+t2); }
							if(t1.length > 1){
								var time = parseInt(t1.slice(5, t1.length -2));
								if(debugFlag == true){ console.log('ping: time: t1: '+time); }
								times = times + time;
								i++;
								cb();
							}else if(t2.length > 1){
								var time = parseInt(t2.slice(5, t2.length -2));
								if(debugFlag == true){ console.log('ping: time: t2: '+time); }
								times = times + time;
								i++;
								cb();
							}else{
								cb();
								i++;
							}
						}else{
							i++;
							cb();
						}
					}else{
						i++;
						cb();
					}
				}, function(){
					var obj = {};
					if(times > 0){
						obj.delay = times / 4;
						obj.state = 'up';
						callback(null, obj);
					}else{
						obj.delay = 0;
						obj.state = 'down';
						callback(null, obj);
					}
				});
			}
		});
	},

	hostStatus: function(callback){
		models.HOST.findAll().complete(function(err, result){
			if(err){
				console.log(err);
			}else{
				if(debugFlag == true){ console.log('hostStatus: hosts: '+result); }
				async.eachSeries(result, function(h, cb){
					var id = h.id;
					var ipAddr = h.ipAddr;
					var hostName = h.hostName;
					var createdAt = h.createdAt;
					var updatedAt = h.updatedAt;
					if(debugFlag == true){ console.log('hostStatus: hosts: loop: '+hostName); }
					l.ping(ipAddr, function(err, p){
						
						/*if(debugFlag == true){ console.log('hostStatus: ping: '+p); }
						if(err){
							console.log(err);
							models.PING.create({HOSTId: h.id, state: 'down' })
							cb();
						}else{
							async.each(p, function(p2, cb2){
								if(debugFlag == true){ console.log('hostStatus: ping: loop: '+p2); }
								models.PING.create({HOSTId: h.id, delay: p2, state: 'up' }).complete(function(err){
									if(err){
										console.log(err);
										cb2();
									}else{
										cb2();
									}
								});
							}, function(){
								cb();
							});
						}*/
					});
				}, function(){

				});
			}
		});
	},
}

/*
{delay: '', state: '', createdAt: '', updatedAt: '', HOSTId: ''}
*/

var l = require('./lib.js');