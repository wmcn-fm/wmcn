var express = require('express');
var shows = express.Router();

var Show = require('../models/Show');
var handleError = require('../lib/handleError');

shows.get('/', function(req, res) {
  var schedule;
  var nowPlaying;
  Show.getSchedule(function(err, result) {
    if (err) return handleError(err, res);
    schedule = result.body.schedule;
    if (req.body.nowPlaying) nowPlaying = req.body.nowPlaying;

    res.render('shows', { title: 'Show schedule', schedule: schedule, nowPlaying: nowPlaying });

  });
});

shows.get('/:id', function(req, res) {
  var nowPlaying;
  Show.getShow(req.params.id, {}, function(err, result) {
    if (err) return handleError(err, res);
    var showTitle = result.show.title;
    if (req.body.nowPlaying) nowPlaying = req.body.nowPlaying;

    res.render('templates/show', {title: showTitle, vars: result, nowPlaying: nowPlaying});
  }); //  getShow
});

module.exports = shows;
