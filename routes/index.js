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





module.exports = router;