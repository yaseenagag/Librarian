var selectAllBooks = require('../config/database.js')
var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function( req, res ) {
  selectAllBooks()
    .then( books => res.json({ books }) )
});

module.exports = router;
