var Show = require('../models/Show');
var mw = {};

mw.getCurrentShow = function() {
  return function(req, res, next) {
    Show.getCurrent({hosts: true}, function(err, nowPlaying) {
      console.log('hello from middleware. here is the payload:\n');
      if (nowPlaying) req.body.nowPlaying = nowPlaying;
      console.log(req.body);
      next();
    });
  }
}



module.exports = mw;
