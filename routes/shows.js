var express = require('express');
var shows = express.Router();

/* GET home page. */
shows.get('/', function(req, res) {
  res.render('shows');
});

module.exports = shows;
