var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var dbUrl = require('../modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});

/** 
*   ====================================================================
*   '/admin'
*/

// GET
router.get('/*', function(req, res, next) {
	res.set('private content');
	next();
})



/** 
*   '/admin/applicants'
*/

//  GET
router.get('/applicants/dj', function(req, res, next) {
    res.render('admin/applicants/dj-applicants', {title: "Dj Applications" })
});

router.get('/applicants/staff', function(req, res, next) {
    res.render('admin/applicants/staff-applicants', {title: "staff Applications" })
});



/**
*   '/admin/users'
*/

//  GET
router.get('/users', function(req, res) {
    var collection = db.collection('usercollection');

    collection.find().toArray(function (err, items) {
        res.render('admin/users/manageUsers', {
        	"userlist" : items,
            title: 'View Database'
        });
	    res.end('testing data');
    });
});



/**
*   '/admin/users/:id'
*/

//  GET
router.get('/users/:id', function(req, res) {
    var id = req.params.id;
    var db = req.db;
    var collection = req.collection;
    console.log('hey hey' + id);
    collection.findById(id, function (err, result) {
        if (err) {
            console.log('error bitch');
        } else {
            console.log('result '+ result);
            res.render('admin/users/editUser', {
                title: 'Edit Account',
                "userInfo": result
            });
        }
    });
});

//  POST
router.post('/updateUser', function(req, res) {
    var db = req.db;
    var collection = req.collection;

    var userId =  mongo.helper.toObjectID(req.body.userId);
    var djStatus = req.body.djStatus;
    var access = req.body.access;
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

    collection.update(
        {_id: userId},
        {'$set':
            {
                djStatus: djStatus,
                access: access,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                studentStatus: studentStatus,
                macIdNum: macIdNum,
                iclass: iclass,
                gradYear: gradYear,
                show: show,
                blurb: blurb
            }
        }, function (err, doc) {
            if (err) {
                res.send('there was a problem updating' + err);
            } else {
                console.log(doc + ' doc');
                res.location('users');
                res.redirect('users');
            }
        }); 
});

//  DELETE
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = req.collection;
    var userToDelete = req.params.id;
    collection.removeById(userToDelete, function(err, result) {
        //res.send((result === 1) ? {msg : ''} : {msg:'error: ' + err});
        if (err) {
            res.send('error: ' + err)
        } else {
            res.send('')
            //res.location('admin/users');
            //res.redirect('admin/users');
        }
    });
});


router.get('/applicants/dj', function(req, res) {
    res.render('admin/applicants/dj', {title: 'dj applications'})
});


/**
*   '/admin/scheduler'
*/

//  GET
router.get('/scheduler', function(req, res) {
    res.render('admin/scheduler', {title: 'schedule creator'})
});



/**
*   '/admin/site'
*/

//  GET
router.get('/site', function(req, res) {
    res.render('admin/site', {title: 'site config'})
});

module.exports = router;