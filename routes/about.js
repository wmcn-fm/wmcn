var express = require('express');
var about = express.Router();
var static_text = require('../config/parse');


/* GET home page. */
about.get('/', function(req, res) {
  console.log(static_text);
  res.render('about', { title: 'About', static: static_text});
});

module.exports = about;
