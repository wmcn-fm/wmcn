var forEachAsync = require('forEachAsync').forEachAsync;
var api = require('../lib/utils');
var Staff = {};

Staff.getAll = function(opts, token, cb) {
  if (opts.hasOwnProperty('sortByAccess')) return Staff.sortByAccess(token, cb);
}


Staff.sortByAccess = function(token, cb) {
  var payload = { 'web': [], 'management': [], 'staff': [], 'dj': [] };
  if (!token) console.log('no token');

  api.get('/users/', function(err, body) {
    if (err) return cb(err);

    forEachAsync(body.users, function(next, user, i, arr) {

      if (user.access === 4) {
        payload['web'].push(user);
      } else if (user.access === 3) {
        payload['management'].push(user);
      } else if (user.access === 2) {
        payload['staff'].push(user)
      } else {
        payload['dj'].push(user)
      }
      next();
    }).then(function() {
      cb(null, payload);
    })
  })
}

Staff.getOne = function(id, opts, token, cb) {
  var payload = {};
  api.get('/users/' + id, function(err, body) {
    if (err) return cb(err);
    payload.user = body.user;
    if (!opts) {
      return cb(null, payload);
    } else if (opts.hasOwnProperty('shows')) {
      return Staff.getShows(payload.user, cb);
    }
  })
}

Staff.getShows = function(user, cb) {
  var payload = {};
  payload.user = user;
  api.get('/users/' + user.id + '/shows', function(e, body) {
    if (e) return cb(e);
    if (body.shows) {
      payload.shows = body.shows;
    }

    cb(null, payload)
  })
}


module.exports = Staff;
