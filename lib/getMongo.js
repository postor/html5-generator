var config = require('../config').mongodb;
var q = require('q');

var getMongo = function(){
  var dbURI = 'mongodb://'+config.host+'/'+config.project;
  var mongoose = require('mongoose');
	var db = mongoose.connection;
  
	db.on('connecting', function() {
    console.log('connecting to MongoDB...');
  });

  db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
  db.on('connected', function() {
    console.log('MongoDB connected!');
  });
  db.once('open', function() {
    console.log('MongoDB connection opened!');
  });
  db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(dbURI, {server:{auto_reconnect:true}});
  });
  mongoose.connect(dbURI);
  return mongoose;
};


exports.mongoose = getMongo();