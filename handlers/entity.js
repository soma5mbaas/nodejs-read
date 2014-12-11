var store = require('haru-nodejs-store');
var getShardKey = require('haru-nodejs-util').common.getShardKey;

var _ = require('underscore');

var keys = require('haru-nodejs-util').keys;
var range = require('../config').query.range;
var async = require('async');


exports.retrieveObejct = function(input, callback) {
	var entity = keys.entityDetail(input.class, input._id, input.applicationId);
    var shardKey = getShardKey(input._id);

    store.get('service').hgetall( entity, function(error, res) {
        callback(error, res);
	}, shardKey);
};

exports.retrieveObejctAll = function(input, callback) {
	var entityKey = keys.entityKey(input.class, input.applicationId);

    store.get('public').zrevrange(entityKey,
        (input.start == undefined ? range.RANGE_DEFALUT_START : input.start) ,
        (input.end == undefined ? range.RANGE_DEFALUT_END : input.end ), function(error, results) {
            if( error ) { return callback(error, results); }
            if( !_.isArray(results) ) { return callback(error, results); }

            var shardCount = store.get('service').getShardCount();
            var shardMulti = [];
            for( var i = 0; i < shardCount; i++ ) {
                shardMulti.push(store.get('service').multi(i));
            }

            for( var i = 0; i < results.length; i++ ) {
                var sharKey = getShardKey(results[i]);
                shardMulti[sharKey].hgetall(keys.entityDetail(input.class, results[i],input.applicationId));
            }
            
            async.times(shardCount, function(n, next) {
                shardMulti[n].exec(next);
            },function done(error, results) {
                var total = [];

                for(var i = 0; i < results.length; i ++) {
                    total = total.concat(results[i]);
                }

                total.sort(function(a, b) {
                    return b.updatedAt - a.updatedAt;
                });

                callback(error, total);
            });

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