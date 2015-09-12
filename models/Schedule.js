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

Schedule.slot = function(slot_id, show_id, token, cb) {
  var url = '/schedule?token=' + token;
  var params = {
    show: {
      timeslot: slot_id,
      show_id: show_id
    }
  }
  api.post(url, params, function(err, result) {
    if (err) return cb(err);
    var res = result.text;
    var json = JSON.parse(res);
    return cb(null, json);
  });
}



module.exports = Schedule;
