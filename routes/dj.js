var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var forEachAsync = require('forEachAsync').forEachAsync;

var artistColl = db.collection('artists');


/** 
*   ====================================================================
*   '/dj'
*/

//  GET
router.get('/', function(req, res) {
    res.render('dj/main', {title: "dj home" })
});



/*
*   '/dj/login'
*/

//  GET
router.get('/login', function(req, res) {
    res.render('dj/login', {title: "dj login" })
});


/*
*   '/dj/user'
*/

//  GET
router.get('/user', function(req, res) {
    res.render('dj/user', {title: "edit user" })
});



/*
*   '/dj/playlist'
*/

//  GET
router.get('/playlist', function(req, res) {
    res.render('dj/playlist', {title: "make a playlist" })
});

//	POST
router.post('/publishPlaylist', function (req, res) {

	var formData = req.body;
	var djId = req.body.dj_id;
	var showId = req.body.show_id;

	var parsedData = [];
	var counter = 0;
	for (var key in formData) {
		var val = formData[key];
		if (counter > 1) {
			parsedData.push(formData[key]);
		}
		counter++;
	}

	forEachAsync(parsedData, function (next, item, index, array) {
		if (index % 2 == 0) {
			console.log('artist ' + index + ': ' + item);
			artistColl.find({name: item}).toArray(function (err, artist) {
				if (err) {console.log(err + ' artist er');} else {
					console.log(artist + '!');
				}
			});
		} else {
			console.log('song ' + index + ': ' + item);
		}
		next();
	}).then(function () {
		console.log('all done');
	});
});

router.get('/review', function(req, res) {
    res.render('dj/review', {title: "write a review" })
});

router.get('/blog', function(req, res) {
    res.render('dj/blog', {title: "write a blog post" })
});

module.exports = router;
