var express = require('express');
var archive = express.Router();
var Playlist = require('../models/Playlist');
var api = require('../lib/utils');
var handleError = require('../lib/handleError');

/* GET home page. */
archive.get('/', function(req, res) {
  res.render('archive', { title: 'Express' });
});

archive.get('/playlists/:id', function(req, res) {
  var id = req.params.id;
  var nowPlaying;
  Playlist.getPlaylist(id, function(err, thePlaylist) {
    if (err) handleError(err, res);

    Playlist.getPlaylists({show_id: thePlaylist.playlist.show_id, limit: 4}, function(err, otherPls) {
      if (req.body.nowPlaying) nowPlaying = req.body.nowPlaying;

      res.render('templates/playlist', {
        playlist: thePlaylist.playlist,
        show: thePlaylist.show,
        hosts: thePlaylist.hosts,
        related: otherPls,
        nowPlaying: nowPlaying
      });
    });  //  getPlaylists
  }); //  getPlaylist
});

module.exports = archive;
