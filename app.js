var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var util = require('util')
var libUser = require('./lib/User');
var libProject = require('./lib/project');

var dump = function(i){
	console.log(util.inspect(i));
}

var app = express();
var config = require('./config');


//配置路由，静态路径，错误处理
app.use('/statics',express.static(__dirname+'/statics'));
app.use('/favicon.ico',express.static(__dirname+'/favicon.ico'));

//设置
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//用户信息
app.use(function(req, res, next){
	if(req.cookies.user){
		req.user = req.cookies.user+'';
	}
	next();
});


//登陆
app.get('/login',function(req, res){
    res.render('login');
});
app.post('/login',function(req, res){
	var User = libUser.user;
    libUser.checkUserPassword(req.body.email,req.body.password,function(dberr,match,result){
    	if(!dberr){
    		if(match){
    		    libUser.setLoinCookie(res,req.body.email);
			    res.redirect('/user/' + req.body.email);
    		}else if(result){
    		    res.render('login',{errormessage:'password and email mismatch, please try again'});
    		}else{
    		    res.render('login',{errormessage:'no such user, please try again'});
    		}
    	}else{
    		res.render('login',{errormessage:'db error, please try again'});
    	}
    });
});


//注册
app.get('/regist',function(req, res){
  res.render('regist');
});
app.post('/regist',function(req, res){
	var err = false;
	if(req.body.password != req.body.repassword){
		err = 'password mismatch retype';
		res.render('regist',{error:err});
	}

    var User = libUser.user;
    User.where('email',req.body.email).findOne(function(errcheckexist,existuser){
    	if(errcheckexist){
    		err = 'db error, please retry';
			res.render('regist',{error:err});
    	}
		if(existuser){
	    	err = 'user exists please login or use another email';
			res.render('regist',{error:err});
	    }else{
	    	var user = new User();
	    	user.email = req.body.email
	    	user.calcPassword(req.body.password);
	    	user.save(function(saveerr){
	    		if(saveerr){
			    	err = 'db save error, please try again';
					res.render('regist',{error:err});
	    		}else{
	    			libUser.setLoinCookie(res,req.body.email);
			    	res.redirect('/user/' + req.body.email);
	    		}
	    	});

	    }
    });

});

//首页
app.get('/',function(req, res, next){	
	console.log(':home:');
  	res.render('index');
});

//以下页面需要登录，用户，编辑
app.use(function(req, res, next){
	console.log(req.url);
	if(/$\/(user|edit)\//.test(req.url) && !req.user){
		res.render(
			'error',
			{
				errormessage:'need login first',
				linkTitle:'go to login page',
				linkUri:'/login'
			}
		);	
	}else{
		next();	
	}
});

app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});

app.param('user', /^[a-zA-Z\._@-]+$/);
app.param('project', /^[0-9a-f]+$/);

//用户页
app.get('/user/:user',function(req, res, next){
	if(req.user === req.params.user+''){
		libProject.getUserProjects(req.user,function(err,resultprojects){
			if(!err){
				res.render('user',
					{
						user:req.params.user,
						projects: resultprojects
					}
				);
			}else{
				res.render('user',
					{
						user:req.params.user,
						errormessage: 'failed to load projects'
					}
				);
			}
		});
	}else{
		res.render(
			'error',
			{
				errormessage:'this is '+req.params.user+'\'s page',
				linkTitle:'go to my page',
				linkUri:'/user/'+req.user
			}
		);
	}
	
});

//项目页
app.get('/project/:project',function(req, res){
	libProject.loadProject(req.params.project,function(err,result){
		if(!err){
			result.pageCount = result.pageCount||1;
			res.render('project',{project:result});
		}else{				
		  	res.render('error',{
		  		errormessage:'project not found'
		  	});
		}
	});
});

//编辑页面
app.get('/edit',function(req, res){
	//存入一个
	libProject.newUserProject(req.user,function(err,result){
		if(!err){
			//跳转到对应
			res.redirect('/edit/' + result._id);
		}else{
			res.render(
				'error',
				{
					errormessage:'db error, please try again',
					linkTitle:'try again!',
					linkUri:'/edit'
				}
			);
		}

	});

});
app.get('/edit/:project',function(req, res){
	libProject.loadProject(req.params.project,function(err,result){
		if(err){
			res.render(
				'error',
				{
					errormessage:'db error, please try again',
					linkTitle:'try again!',
					linkUri:req.url
				}
			);
		}else if(!result){
			res.render(
				'error',
				{
					errormessage:'project not found',
					linkTitle:'show my projects',
					linkUri:'/user/'+req.user
				}
			);
		}else{
			res.render('edit',{
		  		project:result
		  	});
		}
	});
});
app.post('/edit/:project',function(req, res){
	libProject.updateProject(req.body,function(err,result){
		if(err){
			res.render(
				'error',
				{
					errormessage:'db error, please try again',
					linkTitle:'try again!',
					linkUri:req.url
				}
			);
		}else if(!result){
			res.render(
				'error',
				{
					errormessage:'project not found',
					linkTitle:'show my projects',
					linkUri:'/user/'+req.user
				}
			);
		}else{
			res.render('edit',{
		  		project:result
		  	});
		}
	});
});

//启动服务
app.listen(config.http.port);
console.log('service started at port:'+config.http.port);