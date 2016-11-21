var path = require('path')

exports.dbURI = 'nedb://'+path.join(__dirname,'app.db');

exports.baseSecret = 'postor#gmail#com';

exports.http = {
	port: 80
}