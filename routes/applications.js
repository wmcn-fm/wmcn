var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

/** 
*   ====================================================================
*   '/applications'
*/


//  GET
router.get('/applications/dj', function(req, res) {
  res.render('applications/dj', { title: 'Apply to Be a DJ!'});
});

router.get('/applications/staff', function(req, res) {
  res.render('applications/staff', { title: 'Apply for a WMCN Staff Position' })
});

//  POST
router.post('/applications/dj', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

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

    // Set our collection
    var collection = req.collection;

    // Submit to the DB
    collection.insert({
        "djStatus": djStatus,
        "access": 0,
        "firstName" : firstName,
        "lastName" : lastName,
        "email" : email,
        "phone" : phone,
        "studentStatus" : studentStatus,
        "macIdNum" : macIdNum,
        "iclass" : iclass,
        "gradYear" : gradYear,
        "show" : show,
        "blurb" : blurb

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("../admin/users");
            // And forward to success page
            res.redirect("../admin/users");
        }
    });
});

module.exports = router;
