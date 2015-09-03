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

    application.first_name = [req.body.first_name];
    application.last_name = [req.body.last_name];
    application.phone = [req.body.phone];
    application.grad_year = [req.body.grad_year];
    application.email = [req.body.email];
    application.mac_id = [req.body.mac_id];
    application.iclass = [req.body.iclass];
    application.title = req.body.title;
    application.blurb = req.body.blurb;
    application.time_pref= req.body.time_pref;
    application.description = req.body.description;
    application.availability = req.body.availability;

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
