var util = require('haru-nodejs-util');

var getHeader = util.common.getHeader;
var sendError = util.common.sendError;
var parseToJson = util.common.parseToJson;
var parseToJsons = util.common.parseToJsons;

var entityHandler = require('../handlers/entity');
var schemaHandler = require('../handlers/schema');

var async = require('async');

exports.retrieve = function( req, res ) {
	var input = getHeader(req);

	input.class = req.params.classname;
	input._id = req.params._id;

	async.parallel([
		function getSchema(callback) {
			schemaHandler.retrieveSchema(input, callback);
		},
		function getEntity(callback) {	
			entityHandler.retrieveObejct(input,callback);
		}
		], function(error, results) {
			if( error ) { return sendError(res, errorCode.OTHER_CAUSE); } 
			if( results[1] == null ) {  return sendError(res, errorCode.MISSING_ENTITY_ID);  }

			return res.json( parseToJson(results[0], results[1]) );
	});
};

exports.query = function( req, res ) {
	var input = getHeader(req);
	var queryKeys = Object.keys(req.query);

	if( queryKeys.length < 1 ) {
		schemaHandler.retrieveSchema(input, function(error, schema) {
			entityHandler.retrieveObejctAll(input, function(error, results) {
				if( error ) { return sendError(res, errorCode.OTHER_CAUSE); }
				if( results == null) {  return sendError(res, errorCode.MISSING_ENTITY_ID);  }

				return res.json( {results: parseToJsons(schema, results)} );
			});
		});
	} else {
		queryKeys.forEach(function(key) {
			if( key === 'page' ) {
				var condition = JSON.parse(req.query[key]);

				input.start = condition.pageSize * (condition.pageNumber-1);
				input.end = condition.pageSize * condition.pageNumber - 1;

				schemaHandler.retrieveSchema(input, function(error, schema) {
					entityHandler.retrieveObejctAll(input, function(error, results) {
						if( error ) { return sendError(res, errorCode.OTHER_CAUSE); } 

						return res.json( {results: parseToJsons(schema, results)} );
					});
				});
			} else if( key === 'where' ){
				var condition = JSON.parse(req.query[key]);
                var _limit = parseInt( req.query.limit || 50 );
                var _count = parseInt(req.query.count);

                async.series([
                    function find(callback) {
                        if(_limit === 0) { return callback(null, []); }
                        entityHandler.query(input, condition, _limit, callback);
                    },
                    function count(callback) {
                        if( !_count ) { return callback(null, null); }

                        entityHandler.count(input, condition, callback);
                    }
                ], function done(error, results) {
                    if(error) { return sendError(res, error); }

                    var output = { results: results[0] };
                    if(results[1]) {
                        output.count = results[1];
                    }
                    return res.json( output );
                });
			}
		});
	}
};




/**

where={"playerName":"Sean Plott","cheatMode":false}

where={"score":{"$gte":1000,"$lte":3000}}

where={"score":{"$in":[1,3,5,7,9]}}

where={"playerName":{"$nin":["Jonathan Walsh","Dario Wunsch","Shawn Simon"]}}

where={"score":{"$exists":true}}

where={"score":{"$exists":false}}

where={"hometown":{"$select":{"query":{"className":"Team","where":{"winPct":{"$gt":0.5}}},"key":"city"}}}

order=score

order=-score

order=score,-name

limit=200

skip=400

page={ "pageSize": 50, "pageNumber": "1" }


keys=score,playerName

where={"arrayKey":2}

where={"arrayKey":{"$all":[2,3,4]}}

where={"post":{"__type":"Pointer","className":"Post","_id":"8TOXdXf3tz"}}

where={"post":{"$inQuery":{"where":{"image":{"$exists":true}},"className":"Post"}}}

where={"post":{"$notInQuery":{"where":{"image":{"$exists":true}},"className":"Post"}}}
**/