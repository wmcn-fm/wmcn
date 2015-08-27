var express = require('express');
var admin = express.Router();
var handleError = require('../lib/handleError');
var mw = require('../lib/middleware');
var gen_playlist = require('../lib/gen_playlist');
var Playlist = require('../models/Playlist');
var Staff = require('../models/Staff');

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



module.exports = admin;
