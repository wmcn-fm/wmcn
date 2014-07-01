var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

ObjectID = require('mongoskin').ObjectID

/**
*	GET for basic urls
**/

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WMCN: Macalester College Radio' });
});

/* GET archive page. */
router.get('/archive', function(req, res) {
	res.render('archive', {title: "Show Archive" })
});

// /* GET admin manager. */
// router.get('/admin', function(req, res) {
// 	res.render('adminLanding', {title: "Manage useres" })
// });

router.get('/admin/*', function(req, res, next) {
	res.set('private content');
	next();
})

router.get('/admin/users', function(req, res) {
    var db = req.db;
    var collection = req.collection;
    // collection.find({},{},function(e,docs){
    //     res.render('adminLanding', {
    //         "userlist" : docs
    //     });
    // });

    collection.find().toArray(function (err, items) {
        res.render('manageUsers', {
        	"userlist" : items,
            title: 'View Database'
        });
	    res.end('testing data');
    });
});

/* GET edit user */
router.get('/admin/user/:id', function(req, res) {
    var id = req.params.id;
    var db = req.db;
    var collection = req.collection;
    console.log('hey hey' + id);
    collection.findById(id, function (err, result) {
        if (err) {
            console.log('error bitch');
        } else {
            console.log('result '+ result);
            res.render('editUser', {
                title: 'Edit Account',
                "userInfo": result
            });
        }
    });
});


/* GET dj app page. */
router.get('/dj-application', function(req, res) {
  res.render('djApp', { title: 'Apply to Be a DJ!'});
});

/* GET staff app page. */
router.get('/staff-application', function(req, res) {
  res.render('staffApp', { title: 'Apply for a WMCN Staff Position' })
});

/* GET playlist creator. */
router.get('/post/playlist', function(req, res) {
	res.render('createPlaylist', {title: "Create a Playlist" })
});

/* GET post creator. */
router.get('/post/other', function(req, res) {
	res.render('createPost', {title: "Create a post" })
});

/**
*	POST
**/

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

router.post('/dj-application', function(req, res) {

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
            res.location("admin/users");
            // And forward to success page
            res.redirect("admin/users");
        }
    });
});

router.delete('/admin/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = req.collection;
    var userToDelete = req.params.id;
    collection.removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? {msg : ''} : {msg:'error: ' + err});
    });
});



/**
*	admin login credentialing
**/



router.get('/admin/scheduler', function(req, res) {
    var db = req.db;
    db.collection('usercollection').find().toArray(function (err, items) {
        res.json(items);
    });
});



module.exports = router;