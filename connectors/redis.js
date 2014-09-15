var redis = require('redis');

var masters = require('../config').database.redis.masters;
var slaves = require('../config').database.redis.slaves;

var async = require('async');

var keys = require('../utils/keys');

var MAX_SLAVE_COUNTER = 100000000;

function Redis() {
	this.slaveConnectors = [];
	this.slaveCounter = 0;

	this.connect();
};

Redis.prototype.connect = function() {
	var self = this;

	for( var i = 0; i < slaves.length; i++ ){
		var slave = slaves[i];
		var client = redis.createClient(slave.port, slave.host, {parser: 'hiredis'});

		client.on( 'connect', function() {
			console.log( 'Redis[' + slave.host + ':' + slave.port + '] connect ' );
		}).on( 'error', function(error) {
			console.log( 'Redis[' + slave.host + ':' + slave.port + '] error : ' + error );
		}).on( 'close', function(hadError) {
			console.log( 'Redis[' + slave.host + ':' + slave.port + '] closed ' );
		});

		client.select(0);

		self.slaveConnectors.push(client);
	}
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

Redis.prototype.hgetallMulti = function( key, callback ) {
	var self = this;

	var conn = self.getConnection();


	conn.select(0);

	conn.smembers('ns:gameobejcts:appid:keys', function( error, results ) {
		var multi = conn.multi();

		for( var i = 0; i < results.length; i++ ) {
			console.log("#1 ->>> ",results[i]);
			multi.hgetall( keys.objectDetail('gameobejcts', results[i], 'appid') );
		}

		multi.exec(function(error, results) {
			console.log("#2->>> ",results);
			callback( error, results );
		});	
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
