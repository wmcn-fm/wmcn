var express = require('express');
var admin = express.Router();
var handleError = require('../lib/handleError');
var mw = require('../lib/middleware');
var gen_playlist = require('../lib/gen_playlist');
var Playlist = require('../models/Playlist');
var Staff = require('../models/Staff');
var App = require('../models/Application');
var Show = require('../models/Show');
var Schedule = require('../models/Schedule');

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
      req.flash('danger', 'Must submit at least one artist and song');
      return res.status(401).redirect('/admin/playlist');
    }
    var content = gen_playlist(req.body.artist, req.body.song, 'p');
    Playlist.post(req.body.show_id, content, req.session.user, req.session.token, function(err, result) {
      if (err) {
        req.flash('danger', err.status + ': ' + err.text);
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
        req.flash('danger', err);
        return res.redirect('back');
      }
      res.render('templates/admin/applications', {title: 'view aps', apps: result.applications});
    })
  })

admin.route('/applications/clear')
  .get(mw.staffOnly(3), function(req, res) {
    var token = req.session.token;
    App.deleteAll(token, function(err, result) {
      console.log(err, result);
      if (err) {
        req.flash('danger', err);
        return res.redirect('back');
      } else {
        req.flash('success', result);
        res.redirect('/admin/applications');
      }
    });
  })

//  JSON routes are ONLY called via ajax/client-side superagent
admin.route('/applications/:id')
  .post(mw.staffOnly(3), function(req, res) {
    var token = req.session.token;
    var app_id = parseInt(req.params.id);
    var slots = req.body.selectedTimeslot.split(',');
    var parsedTimeslots = [];
    for (var i in slots) {
      if (slots[i]) {
        var inted = parseInt(slots[i]);
        if (typeof inted !== NaN && inted >= 0 && inted <= 167 && parsedTimeslots.indexOf(inted) === -1) {
          parsedTimeslots.push(inted );
        }
      }
    }
    App.approve(app_id, parsedTimeslots, token, function(err, result) {
      console.log('error from App.approve callback:\n\n');
      console.log(err);
      console.log(JSON.stringify(result));
      if (err) return res.json(500, {error: err.detail});
      res.json(200, {result: result});
    })
  })
  .delete(mw.staffOnly(3), function(req, res) {
    var token = req.session.token;
    var app_id = parseInt(req.params.id);
    App.delete(app_id, token, function(err, result) {
      if (err) return res.json(500, {error: err});
      res.json(200, result);
    })
  })

admin.route('/schedule')
  .get(mw.staffOnly(2), function(req, res) {
    Show.getSchedule(function(err, result) {
      if (err) req.flash('danger', err);
      res.render('templates/admin/edit_schedule', {title: 'Edit schedule', schedule: result});
    });
  })

admin.route('/schedule/:slot_id')
  .post(mw.staffOnly(3), function(req, res) {
    if (!req.params.slot_id)  {
      req.flash('danger', 'Must include a timeslot');
      return res.redirect('back');
    }

    var token = req.session.token;
    Schedule.clearSlot(req.params.slot_id, token, function(err, result) {
      if (err) {
        return res.json(500, {error: err});
      } else {
        res.json(200, result);
      }
    });
  });


module.exports = admin;
