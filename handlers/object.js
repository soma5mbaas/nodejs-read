
var redis = require('../connectors/redis');
var keys = require('../utils/keys');
var range = require('../config').query.range;

exports.retrieveObejct = function(input, callback) {
	var key = keys.objectDetail(input.class, input.objectId, input.applicationId);

	redis.hgetall( key, function(error, res) {
		callback(error, res);
	});
};

exports.retrieveObejctAll = function(input, callback) {
	var objectKey = keys.objectKey(input.class, input.applicationId);

	redis.zrange(objectKey, (input.start == undefined ? range.RANGE_DEFALUT_START : input.start) , (input.end == undefined ? range.RANGE_DEFALUT_END : input.end ), function(error, results) {
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
