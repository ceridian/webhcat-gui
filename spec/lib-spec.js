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
	it('should return an object', function(done){
		var targ = '127.0.0.1';
		l.ping(targ, function(err, res){
			expect(err).toBe(null);
			expect(res).not.toBe(null);
			done();
		});
	});
});