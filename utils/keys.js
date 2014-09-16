var ns = require('../config').namespace;

exports.schemaKey = function(applicationId, className) {
	return ns + ':schema:'+ className + ':' +  applicationId;
};

exports.objectDetail = function( className, objectId, applicationId ) {
	return ns+':'+className+':'+objectId+':'+applicationId+':detail';
};

exports.objectKey = function( className, applicationId ) {
	return ns+':'+className+':'+applicationId+':keys';
};