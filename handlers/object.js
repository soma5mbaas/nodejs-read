
var redis = require('../connectors/redis');
var keys = require('../utils/keys');


exports.retrieveObejct = function(input, callback) {
	var key = keys.objectDetail(input.class, input.objectId, input.applicationId);

	console.log(key)

	redis.hgetall( key, function(error, res) {
		if( error ) {
			// send error
			callback( error, {error:error} );
		} else {
			console.log( res );

			callback(error, res);
		}
	});
};

exports.retrieveObejctAll = function(input, callback) {
	var objectKey = keys.objectKey(input.class, input.applicationId);
	console.log(objectKey);
	redis.zrange(objectKey, 0, 50, function(error, results) {
		redis.hgetallMulti( input.applicationId, input.class, results, function(error, results) {
			callback(error, results);
		});
	});

};

exports.query = function(input, callback) {
	var objectKey = keys.objectKey(input.class, input.applicationId);

	redis.hgetallMulti(input, function(error, results) {
		callback(error, results);
	});
};
