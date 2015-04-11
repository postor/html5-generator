var mongoose = require('./getMongo').mongoose;

var projectSchema = mongoose.Schema({ 
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
	});

var Project = mongoose.model('Project', projectSchema);
var getUserProjects = function(email,callback){
	Project.where('email',email).find(callback);
}

var newUserProject = function(email,callback){
	var p = new Project();
	p.email = email;
	p.save(function(err){
		callback(err,p);
	});
}


var loadProject = function(id,callback){
	Project.where('_id',id).findOne(callback);
}

var updateProject = function(project,callback){
	Project.findOneAndUpdate(project.id,project,function(err,result){
		for(var i in project){
			if(i in result){
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