var express = require('express');
var archive = express.Router();

var Playlist = require('../models/Playlists');


archive.route('/')
  .get(function(req, res) {
    res.render('archive', {
      title: 'Archive'
    });
  });


archive.route('/playlists/:id')
  .get(function(req, res) {
    var pl_id = req.params.id;
    Playlist.getPlaylist(pl_id, function(err, result) {
      console.log("result:\t", result);
      res.render('playlist', {
        result: result
      });
    });
  });

module.exports = archive;
