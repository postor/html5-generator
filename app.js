var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
var libUser = require('./lib/User');
var libProject = require('./lib/project');

var dump = function(i){
  console.log(util.inspect(i));
};

var app = express();
var config = require('./config');
console.log(config.dbURI)
require('camo').connect(config.dbURI)

//配置路由，静态路径，错误处理
app.use('/statics',express.static(__dirname+'/statics'));
app.use('/favicon.ico',express.static(__dirname+'/favicon.ico'));

//设置
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false,limit: '5mb' }));
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));

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
    libUser.checkUserPassword(req.body.email,req.body.password)
    .then(function(){
      libUser.setLoinCookie(res,req.body.email);
      res.redirect('/user/' + req.body.email);
    },function(err){
      res.render('login',{errormessage:err+', please try again'});
    });
});


//注册
app.get('/regist',function(req, res){
  res.render('regist');
});
app.post('/regist',function(req, res){
  libUser.createUser(req.body).then(function(user){
    console.log('not rejected!');
    libUser.setLoinCookie(res,req.body.email);
    res.redirect('/user/' + req.body.email);
  },function(err){
    console.log('error?');
    res.render('regist',{error:err+', please retry'});
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
    };
  }
});

app.param('user', /^[a-zA-Z\._@-]+$/);
app.param('project', /^[0-9a-zA-Z]+$/);

//用户页
app.get('/user/:user',function(req, res, next){

  if(req.user === req.params.user+''){
    libProject.getUserProjects(req.user)
    .then(function(resultprojects){
      res.render('user',{
          user:req.params.user,
          projects: resultprojects
        }
      );
    },function(err){
      res.render('user',{
        user:req.params.user,
        errormessage: 'failed to load projects'+err
      });
    });
  }else{
    res.render('error',{
        errormessage:'this is '+req.params.user+'\'s page',
        linkTitle:'go to my page',
        linkUri:'/user/'+req.user
      }
    );
  }
  
});

//项目页
app.get('/project/:project',function(req, res){
  libProject.loadProject(req.params.project[0])
  .then(function(result){
    console.log(result)
    result.pageCount = result.pageCount||1;
    res.render('project',{project:result});
  },function(err){
    res.render('error',{
      errormessage:'error:'+err
    });
  });
});

//编辑页面
app.get('/edit',function(req, res){

  var ready = function(template){
    //存入一个
    libProject.newUserProject(req.user,template)
    .then(function(result){
      res.redirect('/edit/' + result._id);
    },function(err){
      res.render('error',{
            errormessage:'db error, please try again',
            linkTitle:'try again!',
            linkUri:'/edit'
          }
        );
    });
  };

  //如果有模板
  var templid = req.params.template || req.query['template'];
  if(templid){
    libProject.loadProject(templid)
    .then(function(result){
      if(!result){
        res.render('error',{
            errormessage:'template project not found',
            linkTitle:'create a empty one',
            linkUri:'/edit'
          }
        );
      }else{
        ready(result);
      }  
    },function(err){
        res.render('error',{
            errormessage: err+', please try again',
            linkTitle:'try again!',
            linkUri:req.url
          }
        );
    });
  }else{
    ready();
  }
  
});
/**
 * 编辑页面
 */
app.get('/edit/:project',function(req, res){
  libProject.loadProject(req.params.project[0])
  .then(function(result){
    if(!result){
      res.render('error',{
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
  },function(err){
    res.render('error',{
          errormessage: err + ', please try again',
          linkTitle:'try again!',
          linkUri:req.url
        }
      );
  });
});

/**
 * 删除逻辑
 */
app.get('/delete/:project',function(req, res){
  libProject.removeProject(req.params.project[0])
  .then(function(){
    res.redirect('/user/'+req.user);
  },function(err){
    res.render('error',{
          errormessage: err + ', please try again',
          linkTitle:'try again!',
          linkUri:req.url
        }
      );
  });
});


/**
 * 获取项目数据
 */
app.get('/json/:project',function(req, res){
  res.setHeader('Content-Type', 'application/json');
  libProject.loadProject(req.params.project[0])
  .then(function(result){
    res.end(JSON.stringify({error:0,data:result}, null, 2));    
  },function(err){
    res.end(JSON.stringify({error:err}, null, 2));    
  });
});

/**
 * 项目编辑页面保存
 */
app.post('/json/:project',function(req, res){
  res.setHeader('Content-Type', 'application/json');
  libProject.updateProject(req.body)
  .then(function(result){
    res.end(JSON.stringify({error:0,data:result}, null, 2));
  },function(err){
    res.end(JSON.stringify({error:err}, null, 2));
  });
});

/**
 * 上传文件
 */
var fileUpload = require('express-fileupload');
app.use(fileUpload());
app.post('/upload', function(req, res) {  
  res.setHeader('Content-Type', 'application/json');

  if (!req.files) {
    res.end(JSON.stringify({error:'No files were uploaded.'}));
    return;
  }

  var fx = require('mkdir-recursive'),
  path = require('path'),
  d = new Date(),
  targetPath = path.join('statics','uploaded',''+d.getFullYear(),''+(d.getMonth()+1),''+d.getDate());
  
  fx.mkdir(path.join(__dirname,targetPath), function(err) {
    if(err){
      res.end(JSON.stringify({error:'can not save file.'}));
    }

    var imgFile = req.files.img,
    crypto = require('crypto'),
    fileMd5 = crypto.createHash('md5').update(imgFile.data).digest("hex");
    fileExt = path.extname(imgFile.name).toLowerCase(),
    allowExts = ['.jpg','.png','.gif','.webp','.bmp','.svg'];

    if(!(allowExts.indexOf(fileExt)>=0)){
      res.end(JSON.stringify({error:'bad format, plase use:'+allowExts.join(',')}));
    }

    var fullPath = path.join(targetPath,fileMd5+fileExt);
    imgFile.mv(path.join(__dirname,fullPath), function(err) {
      if (err) {
        res.end(JSON.stringify({error:err}));
      } else {
        res.end(JSON.stringify({url:'/'+fullPath.replace(/\\/g,'/')}));
      }
    });
  });

  
});

//启动服务
app.listen(config.http.port);
console.log('service started at port:'+config.http.port);