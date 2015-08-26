var Show = require('../models/Show');
var Auth = require('../models/Auth');
var mw = {};

mw.getCurrentShow = function() {
  return function(req, res, next) {
    Show.getCurrent({hosts: true}, function(err, nowPlaying) {
      if (nowPlaying) req.body.nowPlaying = nowPlaying;
      Show.getUpcoming(1, function(err, nextShow) {
        if (nextShow.shows && req.body.nowPlaying) {
          req.body.nowPlaying['next'] = nextShow.shows;
        } else if (nextShow.shows) {
          req.body.nowPlaying = {show: 'automator'};
          req.body.nowPlaying['next'] = nextShow.shows;
        }

        console.log(req.body.nowPlaying);
        next();
      });
    });
  }
}

mw.staffOnly = function() {
  return function(req, res, next) {
    console.log('this route is for staff only!')
    next();
  }
}

mw.checkForToken = function() {
  return function(req, res, next) {
    console.log('checkForToken called!');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      Auth.verifyToken(token, function(err, resp) {
        if (err) return next();
        req.headers['x-access-token'] = token;
        req.headers['user_access'] = resp.body.decoded.access;
        req.headers['user_id'] = resp.body.decoded.id;
        next();
      });
    } else {
      req.headers['x-access-token'] = null;
      next();
    }
  }
}



module.exports = mw;
