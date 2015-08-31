var express = require('express');
var admin = express.Router();
var handleError = require('../lib/handleError');
var mw = require('../lib/middleware');
var gen_playlist = require('../lib/gen_playlist');
var Playlist = require('../models/Playlist');
var Staff = require('../models/Staff');
var App = require('../models/Application');

admin.route('/')
  .get(mw.staffOnly(1), function(req, res) {
    res.render('templates/admin/landing', {title: 'Admin home'});
  });

admin.route('/playlist')
  .get(mw.staffOnly(1), function(req, res) {
    Staff.getShows(req.session.user, function(err, result) {
      var vars = {title: 'Make a Playlist'};
      if (result.shows) vars['shows'] = result.shows;
      res.render('templates/admin/playlist/new', vars);
    }); //  end getShows
  })
  .post(mw.staffOnly(1), function(req, res) {
    if (!req.body.show_id || !req.body.artist || !req.body.song || req.body.artist[0] === '' || req.body.song[0] === ''){
      req.flash('error', 'Must submit at least one artist and song');
      return res.status(401).redirect('/admin/playlist');
    }
    var content = gen_playlist(req.body.artist, req.body.song, 'p');
    Playlist.post(req.body.show_id, content, req.session.user, req.session.token, function(err, result) {
      if (err) {
        req.flash('error', err.status + ': ' + err.text);
        return res.status(400).redirect('/admin/playlist');
      } else {
        var new_playlist = result.body.new_playlist;
        req.flash('success', result.body.result);
        res.status(201).redirect('/archive/playlists/' + new_playlist.id);
      }
    }); //  Playlist.post

  })  //  end .post

admin.route('/applications')
  .get(mw.staffOnly(2), function(req, res) {
    var user = req.session.user;
    var token = req.session.token;
    App.viewAll(user, token, function(err, result) {
      if (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
      res.render('templates/admin/applications', {title: 'view aps', apps: result.applications});
    })
  })

admin.route('/applications/:id')
  .post(function(req, res) {
    var token = req.session.token;
    var app_id = parseInt(req.params.id);
    var timeslot = parseInt(req.body.selectedTimeslot);
    App.approve(app_id, timeslot, token, function(err, result) {
      console.log('result from router:\n');
      console.log(err, result);
      if (err) return res.json(500, {error: err.detail});
      res.json(200, {result: result});
    })
  })



module.exports = admin;
