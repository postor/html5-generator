var config = require('../config').mongodb;
var q = require('q');

var getMongo = function(){
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://'+config.host+'/'+config.project);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
	  console.log('mongoose is opened');
	});
  return mongoose;
};


exports.mongoose = getMongo();