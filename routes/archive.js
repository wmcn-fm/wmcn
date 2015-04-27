var express = require('express');
var archive = express.Router();

/* GET home page. */
archive.get('/', function(req, res) {
  res.render('archive');
});

module.exports = archive;
