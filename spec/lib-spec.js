var l = require('../lib/lib.js');

// global variables
debugFlag = false;

describe('configs()', function(){
	it('should return config object', function(done){
		l.configs(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('hosts()', function(){
	it('should return list of hosts', function(done){
		l.hosts(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

/*
{delay: '', state: '', createdAt: '', updatedAt: '', HOSTId: ''}
*/

describe('ping()', function(){
	it('should return a ping object', function(done){
		var targ = '127.0.0.1';
		l.ping(targ, function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('hostStatus()', function(){
	it('should return status of all hosts', function(done){
		l.hostStatus(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('status()', function(){
	it('should return all status pings from db', function(done){
		l.status(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
})
