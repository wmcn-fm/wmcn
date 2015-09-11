var api = require('../lib/utils');
var Schedule = {};

Schedule.clearSlot = function(slot_id, token, cb) {
  var url = '/schedule/' + slot_id + '?token=' + token;
  api.del(url, null, function(err, result) {
    if (err) return cb(err);
    var res = result.text;
    var json = JSON.parse(res);
    return cb(null, json);
  })
}



module.exports = Schedule;
