var express = require('express');
var login = express.Router();
var bcrypt = require('bcrypt-nodejs');
var Staff = require('../models/Staff');
var Auth = require('../models/Auth');
var handleError = require('../lib/handleError');

login.route('/')
  .get(function(req, res) {
    res.render('login', {title: 'Login'});
  })  //  end get

  .post(function(req, res) {
    if (!(req.body.user && req.body.password)) {
      req.flash('danger', 'Must submit an email and password');
      return res.redirect('back');
    } else {
      var user = req.body.user;
      var rawPw = req.body.password;
      var sess = req.session;

      Staff.getOneByEmail(user, function(err, resp) {
        if (err) {
          req.flash('danger', err.message);
          return res.redirect('back');
        }
        var userDoc = resp.body.user;
        var storedHash = userDoc.hash;

        bcrypt.compare(rawPw, storedHash, function(err, match) {
          if (!match) {
            req.flash('danger', 'Incorrect password');
            return res.redirect('back');
          }
          Auth.getToken(userDoc, function(err, resp) {
            if (err) {
              req.flash('danger', err.message);
              return res.redirect('back');
            }
            sess.token = resp.body.token;
            sess.user = userDoc;
            sess.cookie.maxAge = 604800000; // 7 days
            res.redirect('/admin');
          })
        }); //  end bcrypt compare
      }); //  end getOneByEmail
    }
  })  //  end post

login.route('/logout')
  .get(function(req, res) {
    var sess = req.session;
    var token = sess.token;
    req.session.regenerate(function(err) {
      if (err) return handleError(new Error(err), res);
      res.redirect('/');
    });
  })


module.exports = login;
