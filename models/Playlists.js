var utils = require('./utils');
var Playlist = {};

Playlist.getAllPlaylists = function(cb) {
  console.log('hello getAllPlaylists');
  utils.get('/playlists/', function(err, result, statusCode) {
    console.log('hello api.get');
    if (err) {
      cb(err);
    } else if (!err && result && statusCode === 200) {
      cb(null, result.playlists);
    } else {
      cb(null, null);
    }
  });
}


Playlist.getPlaylist = function(id, cb) {
  utils.get('/playlists/' + id, function(err, result, statusCode) {
    if (err) {
      cb(err);
    } else if (!err && result && statusCode === 200) {
      cb(null, result.playlist);
    } else {
      cb(statusCode, result.error);
    }
  });
}


module.exports = Playlist;