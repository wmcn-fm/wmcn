var Show = require('../models/Show');
var Auth = require('../models/Auth');
var mw = {};

mw.renderFlash = function() {
  return function(req, res, next) {
    var sess = req.session;
    if (sess.flash && !isEmpty(sess.flash)) {
      res.locals.messages = sess.flash;
      sess.flash = null;
    }
    // console.log(res.locals);
    next();
  }
}

mw.getCurrentShow = function() {
  return function(req, res, next) {
    Show.getCurrent({hosts: true}, function(err, nowPlaying) {
      if (nowPlaying) res.locals.nowPlaying = nowPlaying;
      Show.getUpcoming(1, function(err, nextShow) {
        if (nextShow) {
          res.locals.next = nextShow.shows;
        }
        console.log('hello from getCurrentShow!');
        console.log(JSON.stringify(res.locals));
        next();
      });
    });
  }
}

mw.staffOnly = function(level) {
  return function(req, res, next) {
    var level = level || 1;

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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = mw;
