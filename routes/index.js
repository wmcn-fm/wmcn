var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var playlistColl = db.collection('playlists');
var reviewColl = db.collection('reviews');

var passport = require('passport');

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

// remember that the callback function can be passed the 'id', which is the bigUrl in this case
router.param('bigUrl', function (req, res, next, id) {
	//look into database at userColl to find the bigUrl, and confirmation code
	// this will let us identify the user
	// if confirmation code and bigUrl are from the same record, activate their privileges
	req.bigUrl = id;
	next();
})


router.get('/signup/:bigUrl', function (req, res) {
	console.log(req.bigUrl);
	res.render('confirmation', {djName: "hardcoded dj name", bigUrl: req.bigUrl})
});

// need to change how I access the value when the approve slider works again
// find the user with the unique bigUrl,
	//compare the inputted confirmation code with the confirmation code stored in the user
	// if they match, send a response that allows the user to pick out their password
	// then log them in
router.post('/signup/:bigUrl', function (req, res) {
	console.log("This is the bigUrL on signup/:bigUrl POST: ", req.bigUrl);
	
	// to Array is probably not necessary, but easiest way to get a callback without building my own async function
	userColl.find({"user.bigUrl": req.bigUrl}, {user: 1}).limit(1).toArray(function (err, user) {
		if (err) {
			console.log("Error ", err);
			res.redirect('/signup/:bigUrl');
		}

		user = user[0];
		// console.log("This is the user: ", user);
		// console.log("User typed in this confiCode: ", req.body.confiCode);if 
		// console.log("This is the stored confiCode: ", user.user.confiCode);

		// user must exist and the confirmation code needs to match
		if (user && (user.user.confiCode === req.body.confiCode)) {
			// set up an AJAX call
			res.send("Confirmation code matched up! Set your password!")
		} else {
			res.redirect('/signup/' + req.bigUrl.toString());
		}
	}); // end toArray
	
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