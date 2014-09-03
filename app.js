var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var object = require('./routes/object');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.use('/', routes);
app.use('/users', users);
app.use('/classes', object);


module.exports = app;
