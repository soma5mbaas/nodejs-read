
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

exports.sendError = function(res, errorCode) {
	res.status( errorCode.status ).json( errorCode.info );
};