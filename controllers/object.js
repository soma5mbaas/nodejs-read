var util = require('../utils/util');
var objectHandler = require('../handlers/object');

exports.retrieve = function( req, res ) {
	var input = util.getHeader(req);

	input.class = req.params.classname;
	input.objectId = req.params.objectId;

	objectHandler.retrieveObejct(input, function(error, result) {
		if( error ) {
			// send error
		} else {
			result = result || {error: null};
			res.json(result);
		}
	});
};

exports.query = function( req, res ) {
	var input = util.getHeader(req);

	input.class = req.params.classname;
	input.where = req.param('where');

	objectHandler.query(input, function(error, results) {
		if( error ) {
			// send error
		} else {
			res.json( {results: results} );
		}
	});
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

keys=score,playerName

where={"arrayKey":2}

where={"arrayKey":{"$all":[2,3,4]}}

where={"post":{"__type":"Pointer","className":"Post","objectId":"8TOXdXf3tz"}}

where={"post":{"$inQuery":{"where":{"image":{"$exists":true}},"className":"Post"}}}

where={"post":{"$notInQuery":{"where":{"image":{"$exists":true}},"className":"Post"}}}


**/