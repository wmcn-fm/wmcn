var api = require('../lib/utils');
var Auth = {};

Auth.getToken = function(user, cb) {
  if (!user || !user.email || !user.id) return cb(new Error('Invalid credentials'));
  api.post('/authenticate', {user_id: user.id, hash: user.hash}, function(err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
}

module.exports = Auth;
