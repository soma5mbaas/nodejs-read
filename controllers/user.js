var async = require('async');


var entityHandler = require('../handlers/entity');
var schemaHandler = require('../handlers/schema');

var getHeader = require('haru-nodejs-util').common.getHeader;
var parseToJson = require('haru-nodejs-util').common.parseToJson;
var sendError = require('haru-nodejs-util').common.sendError;


var userClass = 'User';


exports.retrieve = function(req, res) {
    var input = getHeader(req);

    input.class = userClass;
    input._id = req.params._id;

    async.parallel([
        function getSchema(callback) {
            schemaHandler.retrieveSchema(input, callback);
        },
        function getEntity(callback) {
            entityHandler.retrieveObejct(input, function(error, result) {
                if( result && result.password ) {
                    delete result.password;
                }

                callback(error, result);
            });
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

    input.class = userClass;

    if( queryKeys.length < 1 ) {
        schemaHandler.retrieveSchema(input, function(error, schema) {
            entityHandler.retrieveObejctAll(input, function(error, results) {
                if( error ) { return sendError(res, errorCode.OTHER_CAUSE); }
                if( results == null) {  return sendError(res, errorCode.MISSING_ENTITY_ID);  }

                return res.json({results: results});
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
                entityHandler.query(input, condition, function(error, results) {
                    if( error ) { return sendError(res, errorCode.OTHER_CAUSE); }

                    return res.json( {results: results} );
                });
            }
        });
    }
};
