var models = require('../models');
var path = require('path');

module.exports = {
  checkAuth: function(req, res, next){
    if (!req.session.user_id){
      console.log('redirect');
      res.redirect('login');
      next();
    }else{
      console.log('not redirecting');
      next();
    }
  },

  checkUser: function(body, callback){
    var user = body.user;
    var pass = body.pass;
    var obj = {};
    obj.status = null;
    obj.user = user;
    obj.group = null;
    models.USER.find({where: {user: user}}).complete(function(err, result){
      if(err){
        console.log(err);
        callback(err, null);
      }else{
        if(result){
          if(result.pass == pass){
            //req.session.user_id = user;
            obj.status = 'ok';
            obj.group = result.group;
            callback(null, obj);
          }else{
            obj.status = 'Incorrect Password';
            callback(null, obj);
          }
        }else{
          obj.status = 'Incorrect Username';
          callback(null, obj);
        }
      }
    });
  }
}