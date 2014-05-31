var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

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

router.get('/admin', function(req, res) {
    var db = req.db;
    var collection = req.collection;
    // collection.find({},{},function(e,docs){
    //     res.render('adminLanding', {
    //         "userlist" : docs
    //     });
    // });

    collection.find().toArray(function (err, items) {
        res.json(items);
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

// // POST dj app
// 	router.post('/dj-application', function(req, res) {
// 		var db = req.db;
// 		var collection = req.collection;

// 		var djStatus = req.body.djStatus;
// 		//var user = _id;
// 		var firstName = req.body.firstName;
// 		var lastName = req.body.lastName;
// 		var email = req.body.email;
// 		var phone = req.body.phone;
// 		var studentStatus = req.body.studentStatus;
// 		var macIdNum = req.body.macIdNum;
// 		var iclass = req.body.iclass;
// 		var gradYear = req.body.gradYear;
// 		var show = req.body.show;
// 		var blurb = req.body.blurb;

// 		console.log('submitting' + firstName + lastName);
// 		db.collection('usercollection').insert({
// 			"returning": djStatus,
// 			//"user": _id,
// 			"user.access": 0,
// 			"user.name.first": firstName,
// 			"user.name.last": lastName,
// 			"user.contact.email": email,
// 			"user.contact.phone": phone,
// 			"user.student.status": studentStatus,
// 			"user.student.macIdNum": macIdNum,
// 			"user.student.iclass": iclass,
// 			"user.student.year": gradYear,
// 			"show.title": show,
// 			"show.blurb": blurb
// 			//"availability": {};
// 		}, function(err, doc) {
// 			if (err)  {
// 				res.send("u fucked up");
// 			} else {
// 				res.location('admin');
// 				res.redirect('admin');
// 			}
// 		});
// 	});

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
	            res.location("admin");
	            // And forward to success page
	            res.redirect("admin");
	        }
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