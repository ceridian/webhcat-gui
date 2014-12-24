var a = require('../lib/auth.js');

// global variables
debugFlag = false;

// describe('findByName()', function(){
//   it('should return user obj', function(done){
//     a.findByName('admin', function(err, res){
//       expect(err).toBe(null);
//       expect(res).not.toBe(null);
//       done();
//     });
//   });
// });
// 
// describe('findByID()', function(){
//   it('should return user obj', function(done){
//     a.findByName(1, function(err, res){
//       expect(err).toBe(null);
//       expect(res).not.toBe(null);
//       done();
//     });
//   });
// });

describe('checkUser()', function(){
  it('should return user obj', function(done){
    var body = {user: 'admin', pass: 'thispasswdsucks'};
    a.checkUser(body, function(err, res){
      expect(err).toBe(null);
      expect(res).not.toBe(null);
      done();
    });
  });
});
