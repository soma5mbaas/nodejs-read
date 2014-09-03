var express = require('express');
var router = express.Router();
var object = require('../controllers/object');

// /classes/<className>/:<objectId>				POST	Creating Objects
router.get('/:classname/:objectId', object.retrieve );

router.get('/:classname', object.query );

module.exports = router;
