var superagent = require('superagent');
var config = require('../config/config')();
var root = config.api_root_url;

var api = {};

api.get = function(path, cb) {
  var url = root + path;
  superagent.get(url).end(function(err, res) {
    // console.log('result form superagent get:\t' + url)
    // console.log('\n' + err + '\n' + JSON.stringify(res.body ) );
    if (!err) {
      cb(null, res.body);
    } else {
      if (res.statusCode === 404) {
        cb(null, res.body);
      } else {
        cb(err);
      }
    }
  });
}

api.post = function(path, params, cb) {
  var url = root + path;
  superagent.post(url).send(params).end(function(err, res) {
    if (err) cb(err, res.statusCode, res.body);
    cb(null, res.statusCode, res.body);
  });
}


module.exports = api;
