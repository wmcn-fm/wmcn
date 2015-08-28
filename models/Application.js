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

module.exports = App;
