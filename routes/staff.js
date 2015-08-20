var express = require('express');
var staff = express.Router();

var Staff = require('../models/Staff');
var handleError = require('../lib/handleError');

/* GET home page. */
staff.get('/', function(req, res) {
  var token = req.headers['x-accces-token'];
  var staff;

  Staff.getAll({sortByAccess: true}, token, function(err, staff) {
    if (err) return handleError(err, res);
    res.render('staff', { title: 'Staff list', staff: staff});
  });
});

staff.get('/:id', function(req, res) {
  var token = req.headers['x-accces-token'];
  Staff.getOne(req.params.id, {shows: true}, token, function(err, result) {
    if (err) return handleError(err, res);
    var name = result.user.first_name + ' ' + result.user.last_name;
    res.render('templates/user', {title: name, vars: result});
  });
})

module.exports = staff;
