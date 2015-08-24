var express = require('express');
var router = express.Router();

var Playlist = require('../models/Playlist');
var Show = require('../models/Show');
var handleError = require('../lib/handleError');

/* GET home page. */
router.get('/', function(req, res) {
  var nowPlaying;
  var upcoming;
  Show.getUpcoming(4, function(err, upcoming) {
    if (upcoming.shows) upcoming = upcoming.shows;
    console.log(upcoming)
    Playlist.getPlaylists({limit: 4}, function(err, body) {
      if (body.playlists) playlists = body.playlists;
      if (req.body.nowPlaying) nowPlaying = req.body.nowPlaying;
      res.render('index', {title: 'wmcn', playlists: playlists, upcoming: upcoming, nowPlaying: nowPlaying});
    }); //  end getPlaylists
  }); //  end getUpcoming

});

module.exports = router;
