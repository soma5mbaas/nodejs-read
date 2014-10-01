
var redis = require('../connectors/redis');
var keys = require('haru-nodejs-util').keys;

exports.retrieveSchema = function(input, callback) {
	var key = keys.schemaKey(input.applicationId, input.class);

	redis.hgetall( key, function(error, results) {
		if( error ) {}

		callback(error, results);
	});
};