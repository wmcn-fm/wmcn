var forEachAsync = require('forEachAsync').forEachAsync;
var api = require('../lib/utils');
var Show = {};


Show.getSchedule = function(cb) {
  api.get('/schedule/', function(err, body) {
    if (err) return cb(err);

    if (body.schedule) {
      cb(null, body);
    }
  });
}


module.exports = Show;
