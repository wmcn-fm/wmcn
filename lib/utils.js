var superagent = require('superagent');
var config = require('../config/config')();
var root = config.api_root_url;

var api = {};

api.get = function(path, params, cb) {
  if (params) {
    return getAndSend(path, params, cb);
  } else {
    return getNoSend(path, cb);
  }
}

api.post = function(path, params, cb) {
  var url = root + path;
  superagent.post(url).send(params).end(function(err, res) {
    if (err) return cb(err);
    if (res.body.error) return cb(res.body.error);
    return cb(null, res);
  });
}

api.del = function(path, params, cb) {
  var url = root + path;
  superagent.del(url).end(function(err, res) {
    if (err) return cb(err);
    if (res.body.error) return cb(res.body.error);
    return cb(null, res);
  })
}



function getNoSend(path, cb) {
  var url = root + path;
  superagent.get(url).end(function(err, res) {
    if (err) return cb(err);
    if (res.body.error) return cb(res.body.error);
    cb(null, res);
  });
}

function getAndSend(path, options, cb) {
  var url = root + path;
  var settings = {};
  if (options.hasOwnProperty('token')) settings['x-access-token'] = options.token;
  superagent.get(url).set(settings).end(function(err, res) {
    if (err) return cb(err);
    if (res.body.error) return cb(res.body.error);
    cb(null, res);
  });
}


module.exports = api;
