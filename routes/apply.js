var express = require('express');
var apply = express.Router();

/* GET home page. */
apply.get('/', function(req, res) {
  res.render('apply', { title: 'Express' });
});

module.exports = apply;
