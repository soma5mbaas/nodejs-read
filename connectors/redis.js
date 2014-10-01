var redis = require('redis');

var masters = require('../config').database.redis.masters;
var slaves = require('../config').database.redis.slaves;

var async = require('async');

var keys = require('haru-nodejs-util').keys;

var MAX_SLAVE_COUNTER = 100000000;

function Redis() {
	this.slaveConnectors = [];
	this.slaveCounter = 0;

	this.connect();
};

Redis.prototype.connect = function() {
	var self = this;

	slaves.forEach(function(slave) {
		var client = redis.createClient(slave.port, slave.host, {parser: 'hiredis'});

		client.on( 'connect', function() {
			log.info('[%d] %s:%d Redis Connected', process.pid, slave.host, slave.port);
		}).on( 'error', function(error) {
			log.error('[%d] %s:%d Redis Error : %s', process.pid, slave.host, slave.port, error.stack);
		}).on( 'close', function(hadError) {
			log.error('[%d] %s:%d Redis Close', process.pid, slave.host, slave.port);
		});

		client.select(0);

		self.slaveConnectors.push(client);
	});

};

Redis.prototype.hget = function(key, field, callback) {
	var self = this;

	var conn = self.getConnection();

	conn.select(0);
	conn.hget(key, field, callback);
};

Redis.prototype.hvals = function( key, callback ) {
	var self = this;

	var conn = self.getConnection();

	conn.select(0);
	conn.hvals(key, callback);
};

Redis.prototype.hgetall = function( key, callback ) {
	var self = this;

	var conn = self.getConnection();

	conn.select(0);
	conn.hgetall(key, callback);
};

Redis.prototype.zrange = function( key, start, end, callback ) {
	var self = this;

	var conn = self.getConnection();

	conn.select(0);
	conn.zrange(key, start, end, callback);
};

Redis.prototype.hgetallMulti = function( applicationId, className, objectIds, callback ) {
	var self = this;
	var conn = self.getConnection();

	conn.select(0);

	var multi = conn.multi();

	(objectIds || []).forEach(function(objectId) {
		multi.hgetall( keys.entityDetail (className, objectId, applicationId) );
	});

	multi.exec(function(error, results) {
		return callback( error, results );
	});
};

Redis.prototype.smembers = function( key, callback ) {
	var self = this;
	var conn = self.getConnection();

	conn.select(0);

	conn.smembers(key, callback);	
};


Redis.prototype.getConnection = function() {
	var self = this;
	var index = (++self.slaveCounter) % self.slaveConnectors.length;

	if( self.slaveCounter > MAX_SLAVE_COUNTER ) {
		self.slaveCounter = 0;
	}


	return self.slaveConnectors[ index ];
};


module.exports = new Redis();
