var express = require('express');
var router = express.Router();
var entity = require('../controllers/entity');


// entity
router.get('/classes/:classname/:_id', entity.retrieve );
router.get('/classes/:classname', entity.query );

module.exports = router;
