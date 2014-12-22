var exec = require('child_process').exec;
var async = require('async');
var models = require('../models');
var u = require('./util.js');
var request = require('request');

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
				u.error(err, function(e){
					callback();
				});
			}else{
				if(debugFlag == true){ console.log('hostStatus: hosts: '+result); }
				async.mapSeries(result, function(h, cb){
					var id = h.id;
					var ipAddr = h.ipAddr;
					var hostName = h.hostName;
					var createdAt = h.createdAt;
					var updatedAt = h.updatedAt;
					if(debugFlag == true){ console.log('hostStatus: hosts: loop: '+hostName); }
					l.ping(ipAddr, function(err, p){
						if(err){
							var obj = {HOSTId: h.id, state: 'down' };
							models.PING.create(obj).complete(function(err){
								if(err){
									console.log(err);
									u.error(err, function(e){
										cb(null, obj);
									});
								}else{
									cb(null, obj);
								}
							});
						}else{
							var obj = {HOSTId: h.id, state: p.state, delay: p.delay};
							models.PING.create(obj).complete(function(err){
								if(err){
									console.log(err);
									u.error(err, function(e){
										cb(null, obj);
									});
								}else{
									cb(null, obj);
								}
							});
						}
					});
				}, function(err, res){
					if(err){
						callback(err, null);
					}else{
						callback(null, res);
					}
				});
			}
		});
	},

	statusDump: function(callback){
		models.HOST.findAll().complete(function(err, result){
			if(err){
				callback(err, null);
			}else{
				var obj = {};
				async.each(result, function(r, cb){
					obj[r.id] = {
						ip: r.ipAddr,
						host: r.hostName
					};
					cb();
				}, function(){
					models.PING.findAll({order: 'createdAt ASC'}).complete(function(err, pings){
						if(err){
							callback(err, null);
						}else{
							async.map(pings, function(p, cb){
								var info = obj[p.HOSTId];
								var o = {};
								o.Host_ID = p.HOSTId;
								o.Host = info.host;
								o.IP = info.ip;
								o.Delay = p.delay;
								o.Time = p.createdAt;
								o.State = p.state;
								cb(null, o);
							}, function(err, done){
								if(err){
									callback(err, null);
								}else{
									callback(null, done);
								}
							});
						}
					});
				});
			}
		});
	},

	dbs: function(callback){
		l.configs(function(err, conf){
			var targ = conf.webhcat_host.value.current.ipAddr;
			var port = conf.webhcat_port.value;
			var user = conf.query_user.value;
			var cmd = "http://"+targ+":"+port+"/templeton/v1/ddl/database?user.name="+user;
			request.get({
				'url': cmd,
			}, function(err, response, body){
				if(err){
					callback(err, null);
				}else{
					var parsed = JSON.parse(body);
					callback(null, parsed.databases);
				}
			});
		})
	},

	tables: function(db, callback){
		l.configs(function(err, conf){
			var targ = conf.webhcat_host.value.current.ipAddr;
			var port = conf.webhcat_port.value;
			var user = conf.query_user.value;
			var cmd = "http://"+targ+":"+port+"/templeton/v1/ddl/database/"+db+"/table?user.name="+user;
			request.get({
				'url': cmd,
			}, function(err, response, body){
				if(err){
					callback(err, null);
				}else{
					var parsed = JSON.parse(body);
					callback(null, parsed.tables);
				}
			});
		});
	},

	users: function(callback){
		models.USER.findAll().complete(function(err, result){
			if(err){
				callback(err, null);
			}else{
				async.map(result, function(r, cb){
					var obj = {};
					obj.ID = r.id;
					obj.Username = r.user;
					obj.Password = r.pass;
					obj.Group = r.group;
					obj.Email = r.email;
					obj.First_Name = r.firstName;
					obj.Last_Name = r.lastName;
					obj.Created = r.createdAt;
					obj.Updated = r.updatedAt;
					cb(null, obj);
				}, function(err, done){
					callback(null, done);
				});
			}
		});
	}
}


var l = require('./lib.js');
