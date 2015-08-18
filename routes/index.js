var express = require('express');
var router = express.Router();

var Playlist = require('../models/Playlist');
var handleError = require('../lib/handleError');

/* GET home page. */
router.get('/', function(req, res) {
  var playlists;
  Playlist.getPlaylists({limit: 4}, function(err, body) {
    if (err) return handleError(err, res);

    playlists = body.playlists;
    console.log(JSON.stringify(playlists));
    res.render('index', { title: 'wmcn', recent_playlists: playlists });
  });
});

module.exports = router;
