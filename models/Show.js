var forEachAsync = require('forEachAsync').forEachAsync;
var api = require('../lib/utils');
var Playlist = require('./Playlist');
var Show = {};


Show.getSchedule = function(cb) {
  api.get('/schedule/', function(err, body) {
    if (err) return cb(err);

    if (body.schedule) {
      cb(null, body);
    }
  });
}

Show.getShow = function(id, options, cb) {
  var payload = {};
  api.get('/shows/' + id, function(err, body) {
    if (err) return cb(err);
    if (body.error) return cb(body.error);
    if (body['show']) payload['show'] = body['show'];

    Playlist.getPlaylists({show_id: id, limit: 4}, function(e, pl) {
      if (!pl.error && pl.length > 0) payload['playlists'] = pl;

      api.get('/shows/' + id + '/hosts', function(err, body) {
        if (body['hosts']) payload['hosts'] = body['hosts'];
        cb(null, payload);
      }); //  getHosts
    }); //  getPlaylists
  }); //  api.get show id
}

Show.getHosts = function(payload, show_id, cb) {
  if (!payload) payload = {};
  payload['hosts'] = [];
  api.get('/shows/' + show_id + '/hosts', function(e, body) {
    if (e) return cb(e);
    if (body.hosts) {
      payload['hosts'] = body.hosts;
    }
    return cb(null, payload);
  });
}



Show.getCurrent = function(options, cb) {
  var payload = {};
  api.get('/schedule/now', function(err, body) {
    if (err) return cb(err);
    if (body.show) payload['show'] = body.show;

    if (options.hasOwnProperty('hosts') && body.show) {
      return Show.getHosts(payload, body.show.id, cb);
    } else {
      cb(null, payload);
    }
  });
}


module.exports = Show;
