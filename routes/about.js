var express = require('express');
var about = express.Router();

/* GET home page. */
about.get('/', function(req, res) {
  res.render('about');
});

module.exports = about;
