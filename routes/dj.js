var express = require('express');
var router = express.Router();

var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var artistColl = db.collection('artists');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');

var client = require('../tumblr.js');

var forEachAsync = require('forEachAsync').forEachAsync;



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

	// var user = req.body.userId;	//	once login is setup
	var testUser = '53cd88a833e824df184b4557';
	var testShow = '53cd88a833e824df184b4558';

	userColl.findById(testUser, function (err, dj) {
		var djName;
		var date = new Date();
		var showTitle;

		if (err) {djName = ' :(' } else {
			djName = dj.firstName + ' ' + dj.lastName
		}

		showColl.findById(testShow, function (err, show) {

			if (err) {showTitle: ':('} else {
				showTitle = show.hostId;
			}
			res.render('dj/playlist', 
		    	{
		    		title: "make a playlist",
		    		djName: djName,
		    		date: date,
		    		show: showTitle
	    	});
		})

		
	});
});

//	POST
router.post('/playlist', function (req, res) {

	var djId = req.body.dj_id;
	var showId = req.body.show_id;
	var artists = req.body.artistInput;
	var songs = req.body.songInput;

	var date = new Date();

	// var host;
	// getHostName(djId, function (name) {
	// 	console.log(name + ' name');
	// 	host += name;
	// });
	// console.log(host + ': hOST');
	addToArists(artists, songs);

	// var tURL = createTumblrURL(client, djId, showId, artists, songs);

	// archivePlaylist(showId, date, tURL, artists, songs);
	function getHostName(id, cb) {
		var reply;
		userColl.findById(id, function (err, dj) {
			if (err) {
				reply = "db error";
			} else {
				reply = dj.firstName + ' ' + dj.lastName;
			}
			console.log(reply + ' reply');
			cb(reply);
		});
	}

	function addToArists(artists, songs) {
		forEachAsync(artists, function (next, artist, i, array) {
			var count = i;

			//	skip null entries
			if (artist != '') {
				//	query the artist name
				artistColl.find({name: artist}).toArray(function (err, result) {
					if (err) {console.log(err);} else {
						var thisSong = songs[count];
						
						//	1 if a match
						if (result.length != 0) {
							var result = result[0];
							var playedSongs = result.songs;
							var songExists = false;
							// console.log(playedSongs);

							//	check if the song already exists
							for (var i=0; i<playedSongs.length; i++) {
								console.log('==-======= for loop:');
								console.log(playedSongs[i].title, ', ', thisSong);
								// console.log('psi', playedSongs[i].title);
								if (thisSong === playedSongs[i].title) {
									console.log('true!!!');
									console.log(thisSong + ' = ' + playedSongs[i].title);
									songExists = true;
								}
							}
							if (songExists) {	// add 1 to the playcount
								artistColl.update({_id:mongo.helper.toObjectID(result._id), 'songs.title': thisSong},
									{ $inc: {'songs.$.playcount': 1} },
									function (err, updatedArtist) {
										if (err) {console.log(err);} else {
											console.log(updatedArtist);
											next();
										}
									}
								);
							}

							if (!songExists) {	//	add that shit
								artistColl.update({_id:mongo.helper.toObjectID(result._id)},
									{'$addToSet': 
										{'songs': {
											'title': thisSong,
											'playcount' : 1
										}} 
									},
									function (err, updatedArtist) {
										if (err) {console.log(err);} else {
											// console.log(updatedArtist, thisSong);
											next();
										}
									}
								);
							}
							
						} else {	//	if no result, add to the coll
							artistColl.insert({
								"name" : artist,
								"songs" : [{
									title: thisSong,
									playcount: 1
								}]
							}, 
							function (err, newArtist) {
								if (err) {console.log(err);} else {
									console.log('new artist created:');
									console.log(newArtist);
									next();
								}
							});
							
						}
					}
				});
			} else {
				next();
			}
		}).then( function () {
			console.log('all done');
		});
	}

	function createTumblrURL(client, djName, showTitle, artists, songs) {
		var content = '<p>With: ' + djName + '</p>';
		for (var i=0; i<artists.length; i++) {
			var line = '<p>' + artists[i] + ': ' + songs[i] + '</p>';
			content += line;
		} 
		console.log()
		// console.log(content);
		var options = {
			title: showTitle,
			body: content,
			tags: 'playlist'
		}

		client.text('wmcn-dev', options, function (err, post_id) {
			if (err) {
				url = 'wmcn.fm'
			} else {
				url = 'wmcn-dev.tumblr.com/post/' + post_id.id;
			}
			console.log('url: ' + url);
			return url;
		});
		
	}

	function archivePlaylist(show, date, tumblrURL, artists, songs) {
		console.log(show, date, tumblrURL, artists, songs);
	}
});

router.get('/review', function(req, res) {
    res.render('dj/review', {title: "write a review" })
});

router.get('/blog', function(req, res) {
    res.render('dj/blog', {title: "write a blog post" })
});

module.exports = router;
