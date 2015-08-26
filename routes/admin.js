var express = require('express');
var admin = express.Router();
var handleError = require('../lib/handleError');
var mw = require('../lib/middleware');

admin.use(mw.staffOnly());

admin.route('/')
  .get(function(req, res) {
    res.render('templates/admin/landing', {title: 'Admin home'});
  });

admin.route('/playlist')
  .get(function(req, res) {
    res.render('templates/admin/playlist/new', {title: 'hi'});
  })



module.exports = admin;
