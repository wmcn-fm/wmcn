var express = require('express');
var router = express.Router();

var Playlist = require('../models/Playlist');
var Show = require('../models/Show');
var handleError = require('../lib/handleError');

/* GET home page. */
router.get('/', function(req, res) {
  var locals = {};
  var nowPlaying;
  Playlist.getPlaylists({limit: 4}, function(err, body) {
    if (body.playlists) playlists = body.playlists;
    if (req.body.nowPlaying) nowPlaying = req.body.nowPlaying;
    res.render('index', {title: 'wmcn', playlists: playlists, nowPlaying: nowPlaying});
  }); //  end getPlaylists
});

module.exports = router;
