var util = require('haru-nodejs-util');

var getHeader = util.common.getHeader;
var sendError = util.common.sendError;

var configHandler = require('../handlers/config');

var async = require('async');

exports.retrieve = function(req, res) {
    var input = getHeader(req);

    configHandler.retrieve(input, function(error, results) {
        if(error) { return sendError(res, error); }

        res.json(results);
    });
};
