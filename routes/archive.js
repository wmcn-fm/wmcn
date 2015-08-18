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
  Playlist.getPlaylist(id, function(err, result) {
    // console.log(err, result);
    if (err) handleError(err, res);
    res.render('templates/playlist', {
      playlist: result.playlist,
      show: result.show,
      hosts: result.hosts
    });
  });
});

module.exports = archive;
