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

      Staff.getOneByEmail(user, function(err, resp) {
        if (err) return handleError(err, res);
        var userDoc = resp.body.user;
        var storedHash = userDoc.hash;

        bcrypt.compare(rawPw, storedHash, function(err, match) {
          if (!match) return handleError(new Error('Incorrect password'), res);
          Auth.getToken(userDoc, function(err, resp) {
            if (err) return handleError(err, res);
            res.redirect('/?token=' + resp.body.token);
          })
        }); //  end bcrypt compare

      }); //  end getOneByEmail
    }
  })  //  end post


module.exports = login;
