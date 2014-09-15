
var redis = require('../connectors/redis');
var keys = require('../utils/keys');


exports.retrieveObejct = function(input, callback) {
	var key = keys.objectDetail(input.class, input.objectId, input.applicationId);

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


exports.query = function(input, callback) {
	var objectKeys = keys.objectKeys(input.class, input.applicationId);

	redis.hgetallMulti(input, function(error, results) {
		callback(error, results);
	});
	// redis.smembers(objectKeys, function(error, objectIds) {
	// 	var keylist = [];
	// 	for( var i = 0; i < objectIds.length; i++) {
	// 		keylist.push( keys.objectDetail(input.class, objectIds[i], input.applicationId) );
	// 	};

	// 	redis.hgetallMulti(keylist, function(error, result) {
	// 		console.log(result);
	// 		callback(error, result);
	// 	});
	// });
};
