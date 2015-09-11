var express = require('express');
var apply = express.Router();
var App = require('../models/Application');
var static_text = require('../config/parse');

/* GET home page. */
apply.route('/')
  .get(function(req, res) {
    res.render('application', { title: static_text.next_period + ' DJ Application' });
  })
  .post(function(req, res) {
    var application = {};
    var numUsers = parseInt(req.body.num_users);

    console.log(req.body);
    var userFields = ['first_name', 'last_name', 'phone', 'grad_year', 'email', 'mac_id', 'iclass'];

    if (numUsers > 1) {
      for (var f in userFields ) {
        var field = userFields[f];
        application[field] = req.body[field];
        console.log(field, req.body[field]);
        console.log(application);
        // for (var val in application[field]) {
        //   console.log(val, req.body[field][val], application[field][val]);
        //   if (field == 'mac_id' | field == 'iclass' | field == 'time_pref' | field == 'grad_year' | field == 'availability') {
        //     application[field][val] = parseInt(application[field][val]);
        //   }
        // }
      }
    } else if (numUsers === 1) {
      for (var f in userFields) {
        var field = userFields[f];
        application[field] = [req.body[field]];
      }
    }

    application.title = req.body.title;
    application.blurb = req.body.blurb;
    application.time_pref= req.body.time_pref;
    application.description = req.body.description;
    application.availability = req.body.availability;

    console.log(application);

    for (var item in application.mac_id) {
      application.mac_id[item] = parseInt(application.mac_id[item]);
    }
    for (var item in application.iclass) {
      application.iclass[item] = parseInt(application.iclass[item]);
    }
    for (var item in application.time_pref) {
      application.time_pref[item] = parseInt(application.time_pref[item]);
    }
    for (var item in application.availability) {
      application.availability[item] = parseInt(application.availability[item]);
    }

    for (var item in application.grad_year) {
      application.grad_year[item] = parseInt(application.grad_year[item]);
    }

    console.log('final app:\n');
    console.log(application);

    App.post(application, function(err, result) {
      if (err) {
        var json = JSON.parse(err);
        if (json.hasOwnProperty('error')) {
          req.flash('danger', json.error);
        } else {
          req.flash('danger', err);
        }
        return res.redirect('back');
      } else {
        req.flash('success', "We've received your application. If you haven't heard \
                  from us in a week or two, contact the Program Director listed on the \
                  Staff page. If you have any problems with the application contact the\
                  Web Director");
        res.redirect('/');
      }
    });
  });

module.exports = apply;


function returnDiscrepancy(req, res) {
  console.log('returnDiscrepancy fired!');
  console.log(req.body);
  req.flash('error', 'Submitted application contains user info discrepancy. Please review');
  return res.redirect('back');
}
