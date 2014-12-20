var u = require('../lib/util.js');



// global variables
debugFlag = false;

describe('logging', function(){
  describe('log()', function(){
    it('should append to log file', function(done){
      u.log('test', function(err){
        expect(err).not.toBe(null);
        done();
      });
    });
  });

  describe('error()', function(){
    it('should append to error file', function(done){
      u.error('test', function(err){
        expect(err).not.toBe(null);
        done();
      });
    });
  });
});

describe('date functions', function(){
  describe('getFullMinutes()', function(){
    it('should return minutes in new Date() in 01 format', function(done){
      u.getFullMinutes(function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });

  describe('getFullMonth()', function(){
    it('should return month in new Date() in 01 format', function(done){
      u.getFullMonth(function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });

  describe('getFullHours()', function(){
    it('should return hours in new Date() in 01 format', function(done){
      u.getFullHours(function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });

  describe('getFullDate()', function(){
    it('should return date in new Date() in 01 format', function(done){
      u.getFullDate(function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });

  describe('getPreviousDate()', function(){
    it('should return date obj os -x day', function(done){
      u.getPreviousDate(2,function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });

  describe('timeStamp()', function(){
    it('should return timeStamp', function(done){
      u.timeStamp(function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });

  describe('dateStamp()', function(){
    it('should return dateStamp', function(done){
      u.dateStamp(function(m){
        expect(m).not.toBe(null);
        done();
      });
    });
  });
});
