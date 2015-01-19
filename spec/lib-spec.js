var l = require('../lib/lib.js');

// global variables
debugFlag = false;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

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

describe('statusDump()', function(){
	it('should return all status pings from db', function(done){
		l.statusDump(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('dbs()', function(){
	it('should return array of dbs', function(done){
		l.dbs(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('tables()', function(){
	it('should return array of tables', function(done){
		l.tables(function(err, res){
			expect(err).not.toBe(null);
			expect(res).toBe(null);
			done();
		});
	});
});

describe('columns()', function(){
	it('should return columns of table', function(done){
		l.columns(function(err, res){
			expect(err).not.toBe(null);
			expect(res).toBe(null);
			done();
		});
	});
});

describe('users()', function(){
	it('should return array of users', function(done){
		l.users(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('jobs()', function(){
	it('should return job history', function(done){
		l.jobs(function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});

describe('jobDetail()', function(){
	it('should return details of a job', function(done){
		l.jobDetail(function(err, res){
			expect(err).not.toBe(null);
			expect(res).toBe(null);
			done();
		});
	});
});
