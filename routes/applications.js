var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var login = require('./login.js');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var showColl = db.collection('shows');
var userColl = db.collection('usercollection');


var forEachAsync = require('forEachAsync').forEachAsync;



/** 
*   ====================================================================
*   '/apply'
*/


//  GET
// router.get('/dj', function(req, res) {
//   res.render('applications/dj', { title: 'Fall 2014 DJ Application'});
// });

router.get('/', function(req, res) {
	// res.render('applications/dj-spring', {
	// 	title: 'Spring 2015 DJ Application'
	// });
	res.redirect('https://docs.google.com/forms/d/1JVKldgwvnHWMwk4KtN9bUoUOhKUnGiuAwdrXpDQwD3I/viewform?c=0&w=1');
});

router.get('/dj', login.checkLogin, function(req, res) {
	// var u = [];
	// u.cohosts = [];
	// u.info = req.user;
	// if (req.user) {
	// 	//	find all shows the user hosts
	// 	showColl.find({'hostId': req.user._id}).toArray(function (err, shows) {
	// 		if (err) {console.log(err);} else {
	// 			u.shows = shows;

	// 			//	grab user info for each host from each show, append to u
	// 			forEachAsync(u.shows, function (next, show, index, array) {
	// 				u.cohosts.push([]);
	// 				forEachAsync(show.hostId, function (next1, djId, i, a) {
	// 					userColl.findById(djId, function (err, dj) {
	// 						// console.log('the dj object to be inserted into cohosts[', index, ']:\n', dj);
	// 						u.cohosts[index].push(dj);
	// 						next1();
	// 					});
	// 				}).then( function() {
	// 					next();
	// 				});

	// 			}).then( function() {
	// 				console.log('u:\n', u); 
	// 				res.render('applications/dj-spring', { 
	// 					title: 'Spring 2015 DJ Application',
	// 					user: u
	// 				});
	// 			});	//	end then		
	// 		}	//	end if err
	// 	});	//	end showColl.find

	// } else {
	// 	console.log('no user!');
	// 	res.render('applications/dj-spring', {
	// 		title: 'Spring 2015 DJ Application'
	// 	});
	// } 
	res.redirect('https://docs.google.com/forms/d/1JVKldgwvnHWMwk4KtN9bUoUOhKUnGiuAwdrXpDQwD3I/viewform?c=0&w=1');
});

router.get('/mydata', function(req, res) {
	var obj = { dog: "snoop" }
	res.json(obj)
})

// client:




	// res.setHeader('content-type': 'json')
	// res.write(JSON.stringify(obj))
	// res.end()

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
	var description = req.body.description;

	// var testArray = [0, 1, 5];
	var availability = req.body.availability;
	var numDjs = req.body.numDjs;
	var timePref = req.body.timePref;
	var showId = req.body.selectShow;

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
			"availability" : availability,
			"timePref" : timePref,
			"description" : description,
			"showId" : showId
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
