var mylib = require('./mylib')
var baseSecret = require('../config').baseSecret;

var utils = require('util')
var Document = require('camo').Document;

class User extends Document {
    constructor() {
        super();
        this.schema({ 
          email: String,
          password: String,
          salt: String,
          createTime: Number,
          ip: String
        })
    }

    static collectionName() {
        return 'user'
    }
}

var calcPassword = function(password,salt){
  return mylib.md5(mylib.md5(salt+password)+baseSecret)
}

var checkUserPassword = function(email,password){  
  return User.findOne({email:email})
  .then(function(user){
    if(!user) throw '没找到这个用户'
    if(user.password === calcPassword(password,user.salt)){
      return true
    }else{
      throw '密码不正确'
    }
  })}

var setLoinCookie = function(res,email,logOut){  
  res.cookie('user', email, 
              { 
                path: '/', 
                expires: logOut?new Date(Date.now() -1):new Date(Date.now() + 900000000), 
                httpOnly: true,
                maxAge: 900000000 
              }
            );
}

var createUserCheck =  function(data){
  return new Promise((resolve,reject)=>{
    if(data.password === data.repassword){
      resolve(true)
    }else{
      reject('password mismatch retype')
    }
  }).then(()=>{
    return new Promise((resolve,reject)=>{      
      User.findOne({email:data.email}).then((data)=>{
        if(data) reject('user already exists')
        else resolve(true)
      },(err)=>{
        console.log([err])
        resolve(true)
      })
    })
  })
}

var saveUser = function(data){
  data.salt = mylib.randomString(10)
  data.password = calcPassword(data.password,data.salt);
  var id = data._id||data.id
  delete data._id
  delete data.id
  
  return User.findOneAndUpdate({_id:id},data)
}

var createUser = function(data){	
  return createUserCheck(data).then(()=>{    
    data.salt = mylib.randomString(10)
    data.password = calcPassword(data.password,data.salt);
    var user = User.create(data)
    return user.save()
  })
}

exports.user = User;
exports.checkUserPassword = checkUserPassword;
exports.setLoinCookie = setLoinCookie;
exports.createUser = createUser;
exports.logOut = function(res){
  setLoinCookie(res,'',true)
}

