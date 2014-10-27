var keys = require('haru-nodejs-util').keys;
var store = require('haru-nodejs-store');


exports.retrieve = function(input, callback) {

    store.get('public').hgetall( keys.configKey(input.applicationId), function(error, results) {
        if( error ) { return callback(error, results); }

        var objectKey = Object.keys(results);

        for(var i = 0; i < objectKey.length; i++) {
            var key = objectKey[i];

            var index = results[key].indexOf(',');
            var type = results[key].slice(0,index);
            var value = _parse(type, results[key].slice(index+1));

            results[key] = [type, value];
        }

        callback(error, results);
    });
};

function _parse(type, value) {
    if (type === 'number') {
        value = Number(value);
    } else if (type === 'boolean') {
        value = Boolean(value == '1' || value == 'true' || value == 'TRUE');
    } else if (type === 'array') {
        value = value.split(',');
    } else if (type === 'date') {
        value = Number(value);
    }

    return value;
}