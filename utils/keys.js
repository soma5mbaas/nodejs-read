var ns = require('../config').namespace;

exports.schemaKey = function(applicationId, className) {
	return nameSpace + ':' + applicationId +':'+ className +':schema:set';
};


// Data classes Custom Keys : 테이블의 pk를 담는 테이블

// Data classes Custom Detail : 데이터 디테일 테이블
// "ns:gameobejcts:49d2325b-6f14-405c-be6a-85d570ed963f:appid:detail"
exports.objectDetail = function( className, objectId, applicationId ) {
	return ns+':'+className+':'+objectId+':'+applicationId+':detail';
};

exports.objectKeys = function( className, applicationId ) {
	return ns+':'+className+':'+applicationId+':keys';
};