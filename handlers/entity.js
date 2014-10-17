
var redis = require('../connectors/redis');
var mongodb = require('../connectors/mongodb');

var keys = require('haru-nodejs-util').keys;
var range = require('../config').query.range;

exports.retrieveObejct = function(input, callback) {
	var key = keys.entityDetail(input.class, input._id, input.applicationId);

	redis.hgetall( key, function(error, res) {
		callback(error, res);
	});
};

exports.retrieveObejctAll = function(input, callback) {
	var entityKey = keys.entityKey(input.class, input.applicationId);

	redis.zrevrange(entityKey,
        (input.start == undefined ? range.RANGE_DEFALUT_START : input.start) ,
        (input.end == undefined ? range.RANGE_DEFALUT_END : input.end ), function(error, results) {
		redis.hgetallMulti( input.applicationId, input.class, results, function(error, results) {
			callback(error, results);
		});
	});

};

exports.query = function(input, condition, callback) {
	var collectionKey = keys.collectionKey(input.class, input.applicationId);

	mongodb.find( collectionKey, condition, function(error, results) {
		callback(error, results);
	});
};
