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
router.post('/playlist', function (req, res) {

	var djId = req.body.dj_id;
	var showId = req.body.show_id;
	var artists = req.body.artistInput;
	var songs = req.body.songInput;
	
	// console.log(djId, showId, artists, songs);

	//	loop over each artist 
	forEachAsync(artists, function (next, artist, i, array) {
		//	skip null entries
		if (artist != '') {
			//	query the artist name
			artistColl.find({name: artist}).toArray(function (err, result) {
				if (err) {console.log(err);} else {
					var thisSong = songs[i];
					//	1 if a match
					if (result.length != 0) {
						var result = result[0]
						var playedSongs = result.songs;
						var songExists = false;

						//	check if the song already exists
						for (var song in playedSongs) {
							if (thisSong === playedSongs[song]) {
								songExists = true;
							}
							if (songExists) break;	//	if it matches then we're done
						}
						if (!songExists) {	//	if not add that shit
							artistColl.update({_id:mongo.helper.toObjectID(result._id)},
								{$push: {songs: {title: thisSong} }},
								function (err, updatedArtist) {
									if (err) {console.log(err);} else {
										// console.log(updatedArtist, thisSong);
									}
								}
							);
						}
						next();

					} else {	//	if no result, add to the coll
						artistColl.insert({
							"name" : artist,
							"songs" : [{title: thisSong}]
						}, function (err, newArtist) {
							if (err) {console.log(err);} else {
								// console.log(newArtist);
							}
						});
						next();
					}
				}
			});
		} else {
			next();
		}
	}).then( function () {
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
