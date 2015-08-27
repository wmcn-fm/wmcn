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
      return handleError(new Error('Missing login parameters'), res);
    } else {
      var user = req.body.user;
      var rawPw = req.body.password;
      var sess = req.session;

      Staff.getOneByEmail(user, function(err, resp) {
        if (err) return handleError(err, res);
        var userDoc = resp.body.user;
        var storedHash = userDoc.hash;

        bcrypt.compare(rawPw, storedHash, function(err, match) {
          if (!match) {
            req.flash('error', 'Incorrect password');
            console.log(req.flash('error'));
            return handleError(new Error('Incorrect password'), res);
          }
          Auth.getToken(userDoc, function(err, resp) {
            if (err) return handleError(err, res);
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
