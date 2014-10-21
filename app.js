var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');

var routeV1 = require('./routes/routeV1');

var store = require('haru-nodejs-store');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

store.connect(require('./config').store);

app.use('/', index);
app.use('/1', routeV1);


module.exports = app;
