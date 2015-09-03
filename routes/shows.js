var express = require('express');
var shows = express.Router();
var Show = require('../models/Show');
var static_text = require('../config/parse');

shows.get('/', function(req, res) {
  var schedule;
  Show.getSchedule(function(err, result) {
    res.render('shows', { title: static_text.current_period + ' Show Schedule', schedule: result});

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
