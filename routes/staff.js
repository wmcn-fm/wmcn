var express = require('express');
var staff = express.Router();

/* GET home page. */
staff.get('/', function(req, res) {
  res.render('staff');
});

module.exports = staff;
