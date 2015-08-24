var Show = require('../models/Show');
var mw = {};

mw.getCurrentShow = function() {
  return function(req, res, next) {
    Show.getCurrent({hosts: true}, function(err, nowPlaying) {
      if (nowPlaying) req.body.nowPlaying = nowPlaying;
      Show.getUpcoming(1, function(err, nextShow) {
        if (nextShow.shows) req.body.nowPlaying['next'] = nextShow.shows;
        console.log(JSON.stringify(req.body))
        next();
      });
    });
  }
}



module.exports = mw;
