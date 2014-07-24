var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
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
*   Login testing grounds
*/

router.get('/login', function (req, res) {
	res.render('login_test', {title: "Login Testing", message: req.flash('loginMessage')})
});

router.post('/login', passport.authenticate('local-login',
	{ successRedirect : '/profile',
		failureRedirect : '/register',
		failureFlash : true })
);

router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
});

router.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile', {
			user : JSON.stringify(req.user) // get the user out of session and pass to template
		});
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		return next();
	}

	// if they aren't redirect them to the login page
	res.redirect('/login');
}



module.exports = router;