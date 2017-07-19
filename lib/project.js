
var q = require('q');

var Document = require('camo').Document;

class Project extends Document {
    constructor() {
        super();
        this.schema({ 
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
          createdTime: Date,
          modifiedTime: Date,
          pageCount: Number,
          pageHtmls: Array,
          items: {},
          curId: Number,
          pages: Array,
          links: Array
        })
    }

    static collectionName() {
        return 'project';
    }

    validate(){

    }
}

var getProjects = function(limit, skip){
  return Promise.all([Project.find({pageHtmls:{$ne:null}},{sort:'-modifiedTime',limit,skip}),Project.count({pageHtmls:{$ne:null}})])
};

var getUserProjects = function(email){
  return Project.find({email:email},{sort:'-modifiedTime'})
};

var loadProject = function(id){
  return Project.findOne({_id:id}).then((result)=>{
    if(!result){
      console.log('project:['+id+'] not found')
      throw 'project:['+id+'] not found'
    }else{
      return result
    }
  })
};

var newUserProject = function(email,template){
  return new Promise((resolve,reject)=>{
    if(template && template._id){
      resolve(template)
    }else if(template){
      loadProject(template)
      .then((tmpl)=>{
        resolve(tmpl)
      })
    }else{
      resolve({})
    }    
  }).then((tmpl)=>{
    tmpl._toData && (tmpl = tmpl._toData())
    tmpl._id && delete tmpl._id

    var p = Project.create(tmpl)
    p.createdTime = new Date()
    p.modifiedTime = new Date()
    p.email = email
    return p.save()
  })
};


var updateProject = function(project){
  if(!project.title) return Promise.reject('no title')
  if(!project.pageHtmls || !project.pageHtmls.length)  return Promise.reject('no pages')

  project.modifiedTime = new Date();
  return Project.findOneAndUpdate({_id:project.id||project._id},project)
};

var removeProject = function(id){
  return Project.deleteOne({_id:id})
};

exports.getUserProjects = getUserProjects;
exports.newUserProject = newUserProject;
exports.loadProject = loadProject;
exports.updateProject = updateProject;
exports.removeProject = removeProject;
exports.getProjects = getProjects;
