var express = require('express');
var router = express.Router();

var mongo = require('mongoskin');
var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var artistColl = db.collection('artists');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');
var playistColl = db.collection('playlists');

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

		if (err) {djName = ' :( ' } else {
			djName = dj.firstName + ' ' + dj.lastName;
		}

		showColl.findById(testShow, function (err, show) {

			if (err) {showTitle: ':('} else {
				console.log(show);
				showTitle = show.showTitle;
			}
			res.render('dj/playlist', 
		    	{
		    		title: "make a playlist",
		    		djName: djName,
		    		date: date,
		    		show: showTitle
	    	});
		});
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
	archivePlaylist(showId, djId, pairArrays(artists, songs, 'p'));

	// var tURL = createTumblrURL(client, djId, showId, artists, songs);

	// archivePlaylist(showId, date, tURL, artists, songs);
	// function getHostName(id, cb) {
	// 	var reply;
	// 	userColl.findById(id, function (err, dj) {
	// 		if (err) {
	// 			reply = "db error";
	// 		} else {
	// 			reply = dj.firstName + ' ' + dj.lastName;
	// 		}
	// 		console.log(reply + ' reply');
	// 		cb(reply);
	// 	});
	// }

	function addToArists(artists, songs) {
		var artistIds = [];

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
								if (thisSong === playedSongs[i].title) {
									// console.log('true!!!');
									// console.log(thisSong + ' = ' + playedSongs[i].title);
									songExists = true;
								}
							}
							if (songExists) {	// add 1 to the playcount
								artistColl.update({_id:mongo.helper.toObjectID(result._id), 'songs.title': thisSong},
									{ $inc: {'songs.$.playcount': 1} },
									function (err, updatedArtist) {
										if (err) {console.log(err);} else {
											// console.log(updatedArtist);
											artistIds.push(result._id);
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
											artistIds.push(result._id);
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
									// console.log('new artist created:');
									// console.log(newArtist[0]._id);
									artistIds.push(newArtist[0]._id);
									next();
								}
							});
							
						}
					}
				});
			} else {
				next();
			}
		}).then( function (artistIds) {
			console.log('all done');
			// console.log(artistIds);
			// return artistIds;
		});
	}

	function pairArrays(arr1, arr2, htmlElem) {
		var open = '<' + htmlElem + '>';
		var close = '</' + htmlElem + '>';
		var content = '';
		for (var i=0; i<arr1.length; i++) {
			var line = open + arr1[i] + ': ' + arr2[i] + close;
			content += line;
		}
		return content;
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

	function archivePlaylist(showId, djId, bodyContent) {
		var d = new Date();
		var	year = d.getFullYear();
		var	month = d.getMonth();
		var	date = d.getDate();
		var	hour = d.getHours();
		var	min = d.getMinutes();
		var	day = d.getDay();
		var	perma = 'playlist/' + year + '/' + month + '/' + date + '/' + hour + '/'; 
		var	showName;
		var	djName;

		userColl.findById(djId, function (err, dj) {
			if (err) {djName = ' :( ' } else {
				djName = dj.firstName + ' ' + dj.lastName;
			}
			showColl.findById(showId, function (err, show) {
				if (err) {showTitle: ':('} else {
					showName = show.showTitle;
				}
				playistColl.insert({
					"showId": showId,
					"hostId" : djId,
					"showName" : showName,
					"hostName" : djName,
					"date" : {
						"year" : year,
						"month" : month,
						"date" : date,
						"hour" : hour,
						"min" : min,
						"day" : day
					},
					"perma" : perma,
					"content": bodyContent
				}, function (err, newPl) {
					console.log(newPl);
					var link = newPl[0].perma;
					console.log(perma);
					res.render(perma);

				});
				
			});
		});
		
	}
});

router.get('/review', function(req, res) {
    res.render('dj/review', {title: "write a review" })
});

router.get('/blog', function(req, res) {
    res.render('dj/blog', {title: "write a blog post" })
});

module.exports = router;
