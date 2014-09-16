var express = require('express');
var router = express.Router();
var object = require('../controllers/object');


// object
router.get('/classes/:classname/:objectId', object.retrieve );
router.get('/classes/:classname', object.query );

module.exports = router;
