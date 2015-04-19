var mongoose = require('./getMongo').mongoose;

var projectKeys = { 
  email: String,
  name: String,
  title: String,
  desc: String,
  keywords: String,
  tags: String,
  css: String,
  javascript: String,
  additionalScriptCount: Number,
  additionalScripts: Array,
  createdTime: Number,
  modifiedTime: Number,
  pageCount: Number,
  pages: Array
};

var projectSchema = mongoose.Schema(projectKeys);

var Project = mongoose.model('Project', projectSchema);
var getUserProjects = function(email,callback){
  Project.where('email',email).find(callback);
}

var loadProject = function(id,callback){
  Project.where('_id',id).findOne(callback);
}

var newUserProject = function(email,callback,template){
  var p = new Project();
  console.log(template);

  if(template){
    for(var i in projectKeys){
      p.set(i,template[i]);
    }
  }
  p.email = email;
  p.save(function(err){
    callback(err,p);
  });
}


var updateProject = function(project,callback){
  Project.findOneAndUpdate(project.id,project,function(err,result){
    for(var i in project){
      if(i in projectKeys){
        result.set(i,project[i]);
      }
    }
    callback(err,result);
  });
}


exports.getUserProjects = getUserProjects;
exports.newUserProject = newUserProject;
exports.loadProject = loadProject;
exports.updateProject = updateProject;