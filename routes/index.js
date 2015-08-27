var express = require('express');
var router = express.Router();

var Playlist = require('../models/Playlist');
var Show = require('../models/Show');
var handleError = require('../lib/handleError');

/* GET home page. */
router.get('/', function(req, res) {
  var nowPlaying;
  var upcoming;
  var variables = {};
  Show.getUpcoming(4, function(err, upcoming) {
    if (upcoming.shows) variables['upcoming'] = upcoming.shows;
    Playlist.getPlaylists({limit: 4}, function(err, body) {
      if (body.playlists) variables['playlists'] = body.playlists;
      if (req.body.nowPlaying) variables['nowPlaying'] = req.body.nowPlaying;
      res.render('index', variables);
    }); //  end getPlaylists
  }); //  end getUpcoming

});

module.exports = router;
