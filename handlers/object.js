
var redis = require('../connectors/redis');
var keys = require('../utils/keys');


exports.retrieveObejct = function(input, callback) {
	var key = keys.objectDetail(input.class, input.objectId, input.applicationId);
	console.log(key);
	redis.hget( key, input.objectId , function(error, value) {
		if( error ) {
			// send error
			callback( error, {error:error} );
		} else {
			callback(error, JSON.parse(value));
		}
	});
};

exports.query = function(input, callback) {
	var key = keys.objectDetail(input.class, input.objectId, input.applicationId);

	redis.hvals( key, function(error, results) {
		if (error) return callback( error, {error:error});

		for( var i = 0; i < results.length; i++ ) {
				results[i] = JSON.parse(results[i]);
		}

		if(input.where) {
			callback(error, ['1','2','3']);
		} else {
			callback(error, results);
		}
	});
};


// stage.haru.io:6379[9]> keys ns:gameobejcts:*:appid:keys
// 1) "ns:gameobejcts:123456789f:appid:keys"
// 2) "ns:gameobejcts::appid:keys"

