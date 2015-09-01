var api = require('../lib/utils');
var App = {};

App.post = function(app, cb) {
  console.log(app);
  api.post('/applications', {app: app}, function(err, result) {
    if (err) return cb(err.response.text);
    var res = result.text;
    var json = JSON.parse(res);
    return cb(null, json);
  });
}

App.viewAll = function(user, token, cb) {
  api.get('/applications?token=' + token, null, function(err, result) {
    if (err) return cb(err);
    var res = result.text;
    var json = JSON.parse(res);
    return cb(null, json);
  })
}

App.approve = function(app_id, timeslot, token, cb) {
  var url = '/applications/' + app_id + '/approve?token=' + token;
  api.post(url, {timeslot: timeslot}, function(err, result) {
    if (err) {
      if (err.response.hasOwnProperty('text')) {
        var json = JSON.parse(err.response.text);
        return cb(json.error);
      } else {
        return cb(err);
      }
    }
    var res = result.text;
    var json = JSON.parse(res);
    console.log('\n\nhers the json:\n');
    console.log(json);
    return cb(null, json);
  });
}

App.delete = function(app_id, token, cb) {
  var url = '/applications/' + app_id + '?token=' + token;
  api.del(url, null, function(err, result) {
    if (err) return cb(err);
    var res = result.text;
    var json = JSON.parse(res);
    return cb(null, json);
  })
}

module.exports = App;
