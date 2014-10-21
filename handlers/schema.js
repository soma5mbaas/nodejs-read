
var store = require('haru-nodejs-store');
var keys = require('haru-nodejs-util').keys;

exports.retrieveSchema = function(input, callback) {
	var key = keys.schemaKey(input.applicationId, input.class);

    store.get('service').hgetall( key, function(error, results) {
		if( error ) {}

		callback(error, results);
	});
};