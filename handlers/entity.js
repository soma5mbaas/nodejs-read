var store = require('haru-nodejs-store');



var keys = require('haru-nodejs-util').keys;
var range = require('../config').query.range;

exports.retrieveObejct = function(input, callback) {
	var key = keys.entityDetail(input.class, input._id, input.applicationId);

    store.get('service').hgetall( key, function(error, res) {
		callback(error, res);
	});
};

exports.retrieveObejctAll = function(input, callback) {
	var entityKey = keys.entityKey(input.class, input.applicationId);

    store.get('service').zrevrange(entityKey,
        (input.start == undefined ? range.RANGE_DEFALUT_START : input.start) ,
        (input.end == undefined ? range.RANGE_DEFALUT_END : input.end ), function(error, results) {
            var multi = store.get('service').multi();

            for( var i = 0; i < results.length; i++ ) {
                multi.hgetall(keys.entityDetail(input.class, results[i],input.applicationId));
            }

            multi.exec(callback);
	});

};

exports.query = function(input, condition, limit,callback) {
	var collectionKey = keys.collectionKey(input.class, input.applicationId);

    store.get('mongodb').find( collectionKey, condition, limit, function(error, results) {
		callback(error, results);
	});
};

exports.count = function(input, condition,callback) {
    var collectionKey = keys.collectionKey(input.class, input.applicationId);

    store.get('mongodb').findCount( collectionKey, condition, function(error, results) {
        callback(error, results);
    });
};