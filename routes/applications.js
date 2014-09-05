var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});

/** 
*   ====================================================================
*   '/apply'
*/


//  GET
router.get('/dj', function(req, res) {
  res.render('applications/dj', { title: 'fall 2014 dj application'});
});

router.get('/staff', function(req, res) {
  res.render('applications/staff', { title: 'Apply for a WMCN Staff Position' })
});

//  POST
router.post('/dj', function(req, res) {

    // Set our internal DB variable

    // Get our form values. These rely on the "name" attributes

    var djStatus = req.body.djStatus;
    //var user = _id;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var phone = req.body.phone;
    var studentStatus = req.body.studentStatus;
    var macIdNum = req.body.macIdNum;
    var iclass = req.body.iclass;
    var gradYear = req.body.gradYear;
    var show = req.body.show;
    var blurb = req.body.blurb;
    // var testArray = [0, 1, 5];
    var availability = req.body.availability;
    var numDjs = req.body.numDjs;

    console.log(numDjs);

    // Set our collection
    var collection = db.collection('djapps');

    // Submit to the DB
    collection.insert({
        "user" : {
            "access": 0,
            "firstName" : firstName,
            "lastName" : lastName,
            "email" : email,
            "phone" : phone,
            "studentStatus" : studentStatus,
            "macIdNum" : macIdNum,
            "iclass" : iclass,
            "gradYear" : gradYear
        },
        "show": {
            "showTitle" : show,
            "blurb" : blurb
        },
        "app" : {
            // "djStatus" : djStatus,
            "availability" : availability
        }
    }, function (err, doc) {
        if (err) {
            console.log("This is error!: ", err);
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            // res.location("../admin/applicants/dj");
            // // And forward to success page
            // res.redirect("../admin/applicants/dj");
            res.location("../app-success");
            res.redirect("../app-success");
        }
    });
});

module.exports = router;
