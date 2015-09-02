var forEachAsync = require('forEachAsync').forEachAsync;
var api = require('../lib/utils');
var Playlist = require('./Playlist');
var Show = {};


Show.getSchedule = function(cb) {
  api.get('/schedule/', null, function(err, res) {
    if (err) return cb(err);

    if (res.body.hasOwnProperty('schedule')) {
      cb(null, res.body.schedule);
    }
  });
}

Show.getShow = function(id, options, cb) {
  var payload = {};
  api.get('/shows/' + id, null, function(err, res) {
    if (err) return cb(err);
    if (res.body.error) return cb(res.body.error);
    if (res.body['show']) payload['show'] = res.body['show'];

    Playlist.getPlaylists({show_id: id, limit: 4}, function(e, pl) {
      if (pl && !pl.error && pl.length > 0) payload['playlists'] = pl;

      api.get('/shows/' + id + '/hosts', null, function(err, res) {
        if (res.body['hosts']) payload['hosts'] = res.body['hosts'];
        cb(null, payload);
      }); //  getHosts
    }); //  getPlaylists
  }); //  api.get show id
}

Show.getHosts = function(payload, show_id, cb) {
  if (!payload) payload = {};
  payload['hosts'] = [];
  api.get('/shows/' + show_id + '/hosts', null, function(e, res) {
    if (e) return cb(e);
    if (res.body.hosts) {
      payload['hosts'] = res.body.hosts;
    }
    return cb(null, payload);
  });
}



Show.getCurrent = function(options, cb) {
  var payload = {};
  api.get('/schedule/now', null, function(err, res) {
    if (err) return cb(err);
    if (res.body.show) payload['show'] = res.body.show;
    if (res.body.timeslot) payload['timeslot'] = res.body.timeslot;

    if (options.hasOwnProperty('hosts') && res.body.show) {
      return Show.getHosts(payload, res.body.show.id, cb);
    } else {
      cb(null, payload);
    }
  });
}

Show.getUpcoming = function(numShows, cb) {
  var payload = {};
  api.get('/schedule/next?next=' + numShows, null, function(err, res) {
    if (err) return cb(err);
    if (res.body.shows) payload['shows'] = res.body.shows;
    cb(null, payload);
  })
}


module.exports = Show;
