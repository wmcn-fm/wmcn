var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

/** 
*   ====================================================================
*   '/'
*/

//  GET
router.get('/', function(req, res) {
  res.render('index', { title: 'WMCN: Macalester College Radio' });
});

/** 
*   ====================================================================
*   '/archive'
*/

//  GET
router.get('/archive', function(req, res) {
	res.render('archive', {title: "Show Archive" })
});

//  POST
// just js buttons?

/** 
*   ====================================================================
*   '/admin'
*/

// GET
router.get('/admin/*', function(req, res, next) {
	res.set('private content');
	next();
})



/** 
*   '/admin/applicants'
*/

//  GET
router.get('/admin/applicants/dj', function(req, res, next) {
    res.render('admin/applicants/dj-applicants', {title: "Dj Applications" })
});

router.get('/admin/applicants/staff', function(req, res, next) {
    res.render('admin/applicants/staff-applicants', {title: "staff Applications" })
});



/**
*   '/admin/users'
*/

//  GET
router.get('/admin/users', function(req, res) {
    var db = req.db;
    var collection = req.collection;

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
router.get('/admin/users/:id', function(req, res) {
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
                res.location('admin/users');
                res.redirect('admin/users');
            }
        }); 
});

//  DELETE
router.delete('/admin/deleteuser/:id', function(req, res) {
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




/**
*   '/admin/scheduler'
*/

//  GET
router.get('/admin/scheduler', function(req, res) {
    res.render('admin/scheduler', {title: 'schedule creator'})
});



/**
*   '/admin/site'
*/

//  GET
router.get('/admin/site', function(req, res) {
    res.render('admin/site', {title: 'site config'})
});

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

/** 
*   ====================================================================
*   '/dj'
*/

//  GET
router.get('/dj', function(req, res) {
    res.render('dj/main', {title: "dj home" })
});



/*
*   '/dj/login'
*/

//  GET
router.get('/dj/login', function(req, res) {
    res.render('dj/login', {title: "dj login" })
});


/*
*   '/dj/user'
*/

//  GET
router.get('/dj/user', function(req, res) {
    res.render('dj/user', {title: "edit user" })
});



/*
*   '/dj/post'
*/

//  GET
router.get('/dj/post', function(req, res) {
    res.render('dj/post', {title: "make a post" })
});


/** 
*   ====================================================================
*   '/show'
*/

//  GET
router.get('/show/:id', function(req, res) {
    var id = req.params.id;
    res.render('show/viewShow', {title: "dj home: " + id })
});



module.exports = router;