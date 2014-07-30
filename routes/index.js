var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var playlistColl = db.collection('playlists');

var passport = require('passport');

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
*   '/playlist'
*/

router.get('/playlist/:year/:month/:date/:hour', function(req, res) {
	// var contentType = req.params.contentType;
	var year = req.params.year;
	var month = req.params.month;
	var date = req.params.date;
	var hour = req.params.hour;

	var perma = 'x';

	res.render('index', {
		title: 'redirect me'
	});
});

/** 
*   ====================================================================
*   Login testing grounds
*/

// might use router.param for bigUrl

router.param('bigUrl', function (req, res, next, id) {
	//look into database at userColl to find the bigURL, and confirmation code
	// this will let us identify the user
	// if confirmation code and bigUrl are from the same record, activate their privileges
	req.bigUrl = id;
	next();
})


router.get('/signup/:bigUrl', function (req, res) {
	console.log(req.bigUrl);
	res.render('confirmation', {djName: "hardcoded dj name"})
});

router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

router.get('/login', function (req, res) {
	res.render('login_test', {
		title: "Login Testing", 
		message: req.flash('loginMessage') + req.flash('signupMessage')
	}); // end RENDER
});

router.post('/login', passport.authenticate('local-login',
	{ successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true })
);

router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
});


// This is the route that gives the template the user object
// This is given by deserialize user in the passport configuration
// whatever you pass as the second argument will be attached as req.user
router.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile', {
			user : JSON.stringify(req.user) // get the user out of session and pass to template
		});
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		return next();
	}

	// if they aren't redirect them to the login page
	res.redirect('/login');
}