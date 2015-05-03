var mongoose = require('./getMongo').mongoose;
var mylib = require('./mylib');
var q = require('q');

var utils = require('util');
var UserSchema = mongoose.Schema({ 
    email: String,
    password: String,
    salt: String,
    createTime: Number,
    ip: String
  });

var baseSecret = require('../config').baseSecret;
var calcPassword = function(password,salt){
  return mylib.md5(mylib.md5(salt+password)+baseSecret)
}

UserSchema.methods.calcPassword = function (password) {
  password = password || this.password;
  this.salt = mylib.randomString(10);
  this.password = calcPassword(password,this.salt);
  return this.password;
}

var User = mongoose.model('User', UserSchema);

var checkUserPassword = function(email,password){
  var deferred = q.defer();
  User.where('email',email).findOne(function(err,result){
    if(!err){
    	//不存在记录
    	if(!result){
      	deferred.reject(new Error('no such email'));
      	return;
    	}
      var match = (!!result && result.password === calcPassword(password,result.salt));
      if(match){      	
      	deferred.resolve(result);
      }else{
      	deferred.reject(new Error('email and password mismatch'));
      }
    }else{
      deferred.reject(err);
    }
  });
  return deferred.promise;
}

var setLoinCookie = function(res,email){  
  res.cookie('user', email, 
              { 
                path: '/', 
                expires: new Date(Date.now() + 900000), 
                httpOnly: true,
                maxAge:900000 
              }
            );
}

var createUserCheck =  function(data){

	if(data.password != data.repassword){
    throw new Error('password mismatch retype');
  }

  var deferred = q.defer();
	User.where('email',data.email).findOne(function(errcheckexist,existuser){
    if(errcheckexist){
      deferred.reject(errcheckexist);
      return;
    }
    if(existuser){
      deferred.reject(new Error('user already exists'));
      return;
    }

    deferred.resolve(data);
  });  

  return deferred.promise;
}

var saveUser = function(data){
  var deferred = q.defer();

  var user = new User();
  user.email = data.email
  user.calcPassword(data.password);
  user.save(function(saveerr){
  	if(saveerr){
      deferred.reject(new Error('db save error'));
      return;
    };

    deferred.resolve(user);
  });

  return deferred.promise;
}

var createUser = function(data){	
  var deferred = q.defer();
  q.fcall(createUserCheck,data)
  .then(saveUser)
  .done(function(user){
    deferred.resolve(user);
  },function(err){
    deferred.reject(err);
  });

  return deferred.promise;
}

exports.user = User;
exports.checkUserPassword = checkUserPassword;
exports.setLoinCookie = setLoinCookie;
exports.createUser = createUser;