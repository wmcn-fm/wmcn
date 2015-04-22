router.get('/schedule', function(req, res) {
	var shows = [];
	showColl.find({timeslot: {$gte: 0, $lt: 169}}).sort({timeslot: 1}).toArray(function (err, rawShows) {
		if (err) {console.log(err);} else {
			// loop over each show to extract values
			for (i in rawShows) {
				// console.log(rawShows[i].hostId);
				var hostNames = [];

				// iterate over each host ID to get their full name
				for (dj in rawShows[i].hostId) {
					// console.log(rawShows[i].hostId[dj], 'dj!');
					userColl.findById(rawShows[i].hostId[dj], function (err, user) {
						if (err) {console.log(err);} else {
							var hostName = user.firstName + ' ' + user.lastName;
							console.log(hostName);
							hostNames.push(hostName);
							// console.log('hostNames: ', hostNames);
						}
					});
				}
				console.log('after dj id loop=====');
				console.log(hostNames);
				// initialize JSON object containing all render info
				var show = {
					'showTitle' : rawShows[i].showTitle,
					'timeslot' : rawShows[i].timeslot,
					'blurb' : rawShows[i].blurb,
					'hosts' : hostNames
				}
				shows.push(show);
				hostNames.length = 0;
			}
			console.log(shows);
			res.render('schedule', {
				title: "Fall 2014 Show Schedule",
				shows: shows
			});
		}	
	});	
});