import temp from "../views/temp.pug"
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(temp);
});

module.exports = router;
