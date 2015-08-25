var forEachAsync = require('forEachAsync').forEachAsync;
var api = require('../lib/utils');
var Staff = {};

Staff.getAll = function(opts, token, cb) {
  if (opts.hasOwnProperty('sortByAccess')) return Staff.sortByAccess(token, cb);
}


Staff.sortByAccess = function(token, cb) {
  var payload = { 'web': [], 'management': [], 'staff': [], 'dj': [] };
  var settings = {};
  if (token) {
    settings['token'] = token;
    console.log('sortByAccess detected token! here it is:\t%s', token);
  } else {
    console.log('sortByAccess did not detect a token');
    settings = null;
  }

  api.get('/users/', settings, function(err, res) {
    if (err) return cb(err);

    forEachAsync(res.body.users, function(next, user, i, arr) {

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
  var settings = {};
  if (token) {
    settings['token'] = token;
    console.log('Staff.getOne detected token! here it is:\t%s', token);
  } else {
    console.log('Staff.getOne did not detect a token');
    settings = null;
  }

  api.get('/users/' + id, settings, function(err, res) {
    if (err) return cb(err);
    payload.user = res.body.user;
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
  api.get('/users/' + user.id + '/shows', null, function(e, res) {
    if (e) return cb(e);
    if (res.body.shows) {
      payload.shows = res.body.shows;
    }

    cb(null, payload);
  })
}


module.exports = Staff;
