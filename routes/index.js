var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var playlistColl = db.collection('playlists');
var reviewColl = db.collection('reviews');
var blogColl = db.collection('blogs');

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
	var playlists = [];
	var reviews = [];
	var blogs = [];
	playlistColl.find().sort({$natural: -1}).limit(4).toArray(function (err, pls) {
		if (err) { res.render('error')} else {
			playlists = pls;
		}
		reviewColl.find().sort({$natural: -1}).limit(4).toArray(function (err, rvws) {
			if (err) {res.render('error')} else {
				reviews = rvws;
			}
			blogColl.find().sort({natural: -1}).limit(2).toArray(function (err, blgs) {
				if (err) {res.render('error')} else {
					blogs = blgs;
				}
				res.render('index', { 
					title: 'WMCN: Macalester College Radio',
					playlists: playlists,
					reviews: reviews,
					blogs: blogs,
				});
			});
		});
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


router.get('/app-success', function(req, res) {
	res.render('app-success', {
		title: 'thank you for your application!',
	});
});


//  POST
// just js buttons?
/** 
*   ====================================================================
*   '/playlist'
*/

router.get('/playlist', function(req, res) {
	playlistColl.find().limit(10).toArray(function (err, result) {
		console.log(result);
	});
});

router.get('/playlist/:showName/:year/:month/:date/:hour', function(req, res) {
	playlistColl.find({perma: req.url}).toArray(function (err, result) {
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

router.get('/reviews', function(req, res) {
	reviewColl.find().limit(10).toArray(function (err, result) {
		if (err) {res.render('error')} else {
			console.log(result);
			res.render('page-layout', {
				last10: result[0]
			});
		}
	});
});

router.get('/review/:artistName/:year/:month/:date', function(req, res) {
	reviewColl.find({perma: req.url}).toArray(function (err, result) {
		if (err) { res.render('error') } else {
			console.log(result);
			var rv = result[0];
			var title = rv.artistName + ': ' + "'" + rv.album + "'";
			var dj = rv.djName;
			var perma = rv.perma;
			var fullDate = rv.date;
			var imgUrl = rv.imgUrl;
			var content = rv.content;
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
					currentShow: currentShow,
					imgUrl: imgUrl
				});
			}
		}
	});
});

/** 
*   ====================================================================
*   '/blog'
*/

router.get('/blog/:year/:month/:date/:hour', function(req, res) {
	console.log(req.url);
	blogColl.find({perma: req.url}).toArray(function (err, result) {
		if (err) { res.render('error') } else {
			console.log(result);
			var blg = result[0];
			var title = blg.title;
			var dj = blg.djName;
			var perma = blg.perma;
			var fullDate = blg.date;
			var content = blg.content;
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
	{ successRedirect : '/',
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