var express = require('express');
var router = express.Router();

var entity = require('../controllers/entity');
var user = require('../controllers/user');
var config = require('../controllers/config');


// entity
router.get('/classes/:classname/:_id', entity.retrieve );
router.get('/classes/:classname', entity.query );

// user
router.get('/user/:_id', user.retrieve);
router.get('/user/:_id', user.query);

// config
router.get('/config', config.retrieve);



module.exports = router;


