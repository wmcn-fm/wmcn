var express = require('express');
var staff = express.Router();

var Staff = require('../models/Staff');
var static_text = require('../config/parse');

/* GET home page. */
staff.get('/', function(req, res) {
  var token = req.headers['x-accces-token'];
  var staff;

  Staff.getAll({sortByAccess: true}, token, function(err, staff) {
    if (!staff || err) return res.status(404).render('error', {message: 'Not Found', error: {status: 404}});
    res.render('staff', { title: 'Staff List', staff: staff});
  });
});

staff.get('/:id', function(req, res) {
  var token = req.headers['x-accces-token'];
  var nowPlaying;

  Staff.getOne(req.params.id, {shows: true}, token, function(err, result) {
    if (err) return res.render('error', {error: err});
    var name = result.user.first_name + ' ' + result.user.last_name;

    res.render('templates/user', {title: name, vars: result});
  });
})

module.exports = staff;
