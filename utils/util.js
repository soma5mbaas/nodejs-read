
function getAPIInfo( req ) {
	var api = {};

	if( api.id = req.get('Rest-API-Id') ) {
		api.type = 'rest';
	} else if( api.id = req.get('Android-API-Id') ) {
		api.type = 'android';
	} else if( api.id = req.get('Ios-API-Id') ) {
		api.type = 'ios';
	} else if( api.id = req.get('Javascript-API-Id') ) {
		api.type = 'javascript';
	}

	return api;
};


exports.getHeader = function( req ) {
	var header = {};
	// 기본 정보 
	header.applicationId = req.get('Application-Id');
	header.api = getAPIInfo( req );

	// 옵션 정보
	if( req.params.classname ) header.class = req.params.classname;
	if( req.params.objectid ) header.objectId = req.params.objectid;  

	return header;
};

exports.sendError = function(error, res, errorCode) {
	// TODO error logging
	
	res.status( errorCode.status ).json( errorCode.info );
};

exports.parseToJsons = function( schema, jsons ) {
	jsons.forEach(function(json) {
		json = exports.parseToJson(schema, json);
	});

	return jsons;
}

exports.parseToJson = function (schema, json) {
	var keys = Object.keys(json);

	for( var i = 0; i < keys.length; i++ ) {
		var key = keys[i];
		if( schema[key] === 'number' ) {
			json[key] = Number(json[key]); 
		} else if( schema[key] === 'boolean' ) {
			json[key] = Boolean(json[key]); 
		} else if( schema[key] === 'array' ) {
			json[key] = json[key].split(','); 
		}
	}

	return json;
};