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

        // console.log(req.body.nowPlaying);
        next();
      });
    });
  }
}

mw.staffOnly = function() {
  return function(req, res, next) {
    var sess = req.session;
    var token = sess.token;
    if (!token) {
      res.redirect('/login');
    } else {
      Auth.verifyToken(token, function(err, resp) {
        if (err) return res.redirect('/login');
        next();
      })
    }
  }
}

mw.setCurrentUser = function() {
  return function(req, res, next) {
    var sess = req.session;
    if (sess.user) {
      res.locals.current_user = sess.user;
    }
    next();
  }
}

module.exports = mw;
