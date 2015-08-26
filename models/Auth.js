var api = require('../lib/utils');
var Auth = {};

Auth.getToken = function(user, cb) {
  if (!user || !user.email || !user.id) return cb(new Error('Invalid credentials'));
  api.post('/authenticate', {user_id: user.id, hash: user.hash}, function(err, result) {
    if (err) return cb(err);
    cb(null, result);
  });
}

Auth.verifyToken = function(token, cb) {
  if (!token) return cb(new Error('missing token'));
  api.get('/authenticate/verify?token=' + token, null, function(err, result) {
    if (err) return cb(err);
    cb(null, result);
  })
}

module.exports = Auth;
