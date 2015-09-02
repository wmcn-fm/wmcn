var express = require('express');
var shows = express.Router();

var Show = require('../models/Show');
var handleError = require('../lib/handleError');

shows.get('/', function(req, res) {
  var schedule;
  Show.getSchedule(function(err, result) {
    res.render('shows', { title: 'Show schedule', schedule: result});

  });
});

shows.get('/:id', function(req, res) {
  Show.getShow(req.params.id, {}, function(err, result) {
    console.log(err, result);
    if (!result) {
      res.status(404).render('error', {message: 'Not Found', error: {status: 404}});
    }
    res.render('templates/show', result);
  }); //  getShow
});

module.exports = shows;
