var ns = require('../config').namespace;

exports.schemaKey = function(applicationId, className) {
	return ns + ':schema:'+ className + ':' +  applicationId;
};

exports.entityDetail = function( className, _id, applicationId ) {
	return ns+':'+className+':'+_id+':'+applicationId+':detail';
};

exports.entityKey = function( className, applicationId ) {
	return ns+':'+className+':'+applicationId+':keys';
};