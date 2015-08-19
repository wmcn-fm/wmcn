var express = require('express');
var shows = express.Router();

var Show = require('../models/Show');
var handleError = require('../lib/handleError');

shows.get('/', function(req, res) {
  var schedule;
  Show.getSchedule(function(err, result) {
    if (err) return handleError(err, res);

    schedule = result.schedule;
    res.render('shows', { title: 'Show schedule', schedule: schedule });

  });
});

module.exports = shows;
