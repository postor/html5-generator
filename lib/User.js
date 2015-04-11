var mongoose = require('./getMongo').mongoose;
var mylib = require('./mylib');

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

var checkUserPassword = function(email,password,callback){
	User.where('email',email).findOne(function(err,result){
		if(!err){
			var match = (!!result && result.password === calcPassword(password,result.salt));
			callback(null,match,result);
		}else{
			callback(err);
		}
	});
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

exports.user = User;
exports.checkUserPassword = checkUserPassword;
exports.setLoinCookie = setLoinCookie;