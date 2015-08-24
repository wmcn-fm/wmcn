var forEachAsync = require('forEachAsync').forEachAsync;
var api = require('../lib/utils');
var Playlist = {};

// @param options: JSON object which may contain the following fields:
//    show_id: int, a show's ID number; if present will only return
//            plyalists from this show
//    limit: int, # of playlists max
Playlist.getPlaylists = function(options, cb) {
  var payload = {};
  payload.playlists = [];
  var query = '/playlists';

  if (options.hasOwnProperty('show_id')) {
    query = '/shows/' + options['show_id'] + '/playlists';
  }
  if (options.hasOwnProperty('limit')) {
    query += "?limit" + '=' + options['limit'];
  }

  api.get(query, function(err, body) {
    if (err)return cb(err);
    if (body.playlists) {
      if (!options['show_id']) {
        forEachAsync(body.playlists, function(next, p, i, arr) {
          Playlist.getPlaylist(p.id, function(err, pl) {
            if (err) return cb(err);
            payload['playlists'].push(pl);
            next();
          });
        }).then(function () {
          cb(null, payload);
        });
      } else {
        cb(null, body.playlists);
      }
    } else if (body.error) {
      cb(body.error, body);
    } else {
      cb(null, null);
    }
  });
}

Playlist.getPlaylist = function(id, cb) {
  var playlist;
  var show;
  var hosts;
  var payload = {};
  api.get('/playlists/' + id, function(err, body) {
    if (err) return cb(err);

    payload['playlist'] = body.playlist;
    var show_id = body.playlist.show_id;

    api.get('/shows/' + show_id, function(err, body) {
      if (err) return cb(err);

      payload['show'] = body.show;

      api.get('/shows/' + show_id + '/hosts', function(err, body) {
        if (err) return cb(err);

        if (body.hosts) payload['hosts'] = body.hosts;
        cb(null, payload);
      }); //  api get hosts
    }); //   api get show_id
  }); //  api get playlist id
}


module.exports = Playlist;
