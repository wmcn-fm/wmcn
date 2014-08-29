var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var playlistColl = db.collection('playlists');
var reviewColl = db.collection('reviews');

var passport = require('passport');
var login = require('./login.js');

var navCats = ['archive', 'schedule', 'reviews', 'news', 'info'];


var userColl = db.collection('usercollection'); // for login testing

/** 
*   ====================================================================
*   '/'
*/

//  GET
router.get('/', function(req, res) {
  res.render('index', { 
  	title: 'WMCN: Macalester College Radio',
  	navCategories: navCats

  });
});

/** 
*   ====================================================================
*   '/archive'
*/

//  GET
router.get('/archive', function(req, res) {
	res.render('archive', {
		title: "Show Archive",
	  	navCategories: navCats
	});
});


//  POST
// just js buttons?
/** 
*   ====================================================================
*   '/playlist'
*/

router.get('/playlist/:showName/:year/:month/:date/:hour', function(req, res) {
	playlistColl.find({showName: req.params.showName, perma: req.url}).toArray(function (err, result) {
		if (err) { res.render('error') } else {
			var pl = result[0];
			var title = pl.showName + ' ' + pl.date.month + '/' + pl.date.date;
			var dj = pl.hostName;
			var perma = pl.perma;
			var fullDate = pl.date;
			var content = pl.content;
			var alertInfo;

			if (req.flash('tumblrURL').length) {
				alertInfo = req.flash('tumblrURL');
				console.log('if!!');
				var currentShow = 'foood';				
				renderWithInfo(currentShow);
			} else {
				console.log('else!! - no info');
				alertInfo = req.flash('tumblrURL');
				// res.render('playlist-layout', {
				// 	title: title,
				// 	dj: dj,
				// 	perma: perma,
				// 	date: fullDate,
				// 	content: content
				// });
				var currentShow = 'foood';
				renderWithInfo(currentShow);
			}

			function renderWithInfo(currentShow) {
				console.log('renderWithInfo!!!!');
				res.render('playlist-layout', {
					title: title,
					dj: dj,
					perma: perma,
					date: fullDate,
					content: content,
					alertInfo: alertInfo,
					currentShow: currentShow
				});
			}
		}
	});
});

/** 
*   ====================================================================
*   '/review'
*/

router.get('/review/:artist/:year/:month/:date/:hour', function(req, res) {
	reviewColl.find({perma: req.url}).toArray(function (err, result) {
		if (err) { res.render('error') } else {
			console.log(result);
			var review = result[0];
			var title = review.artistName + ': ' + review.albumName;
			var dj = review.djName;
			var perma = review.perma;
			var fullDate = review.date;
			var content = review.content;
			var alertInfo;

			if (req.flash('tumblrURL').length) {
				alertInfo = req.flash('tumblrURL');
				console.log('if!!');
				var currentShow = 'foood';				
				renderWithInfo(currentShow);
			} else {
				console.log('else!! - no info');
				alertInfo = req.flash('tumblrURL');
				// res.render('playlist-layout', {
				// 	title: title,
				// 	dj: dj,
				// 	perma: perma,
				// 	date: fullDate,
				// 	content: content
				// });
				var currentShow = 'foood';
				renderWithInfo(currentShow);
			}

			function renderWithInfo(currentShow) {
				console.log('renderWithInfo!!!!');
				res.render('playlist-layout', {
					title: title,
					dj: dj,
					perma: perma,
					date: fullDate,
					content: content,
					alertInfo: alertInfo,
					currentShow: currentShow
				});
			}
		}
	});
});

/** 
*   ====================================================================
*   Login testing grounds
*/

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
// passport attaches the user object to the req.
router.get('/profile', login.isLoggedIn, login.accessClearance(1), function (req, res) {
	res.render('profile', {
		user : JSON.stringify(req.user) // get the user out of session and pass to template
	});
});

module.exports = router;