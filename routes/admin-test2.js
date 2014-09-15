router.post('/applicants/dj', function(req, res) {
	var approved = req.body.data;
	//	loop over every application
	forEachAsync(approved, function (next, application, index, array) {
		appColl.findById(application, function (err, app) {
			if (err) {res.send('error');} else {
				// console.log(app);

				//	loop over each user in the application
				forEachAsync(app.user.email, function (next1, usr, ix, arr) {
					if (usr != '') {
						var isNewUser = true;

						//	check to see if the user already exists
						userColl.find({email: usr}).toArray(function (err, result) {
							if (err) {res.send('error');} else {

								if (result.length != 0) {	//	user exsts
									isNewUser = false;

									showColl.update({
										"showTitle" : app.show.showTitle,
										"blurb" : app.show.blurb,
										"timeslot" : 9999,
									}, {$push: {hostId: result[0]._id} },
									{upsert: true}, function (err, shw) {
										console.log('added old dJ to show. here is the show: ');
										console.log(shw);
										next1();
									});	//	end showColl.update

								} else {	//	user doesnt exist
									console.log('user doesnt exist!');
									var pass = randomString(10, alphanumeric);
									var mailOptions = {
			                            from: 'WMCN noreply <noreply@wmcn.fm>', // sender address
			                            to: usr, // list of receivers
			                            subject: 'WMCN Login info', // Subject line
			                            html: '<b>This is a WMCN test email</b>' +
			                                  '<p> Your login email is: ' + usr + '</p>' +
			                                  '<p> This is your temporary password: ' + pass + '</p>' +
			                                  '<p> your name is: ' + app.user.firstName[ix] +'</p>' + 
			                                  '<p> your show is: ' + app.show.showTitle + '</p>'
			                        }
			                        transporter.sendMail(mailOptions, function (error, info){
			                            if(error){
			                                console.log(error);
			                            }else{
			                                console.log('Message sent: ' + info.response);
			                            }
			                        });

			                        bcrypt.hash(pass, null, null, function (err, hash) {
			                        	userColl.insert({
			                        		"access" : 1,
			                        		"firstName" : app.user.firstName[ix],
			                        		"lastName" : app.user.lastName[ix],
			                        		"email" : usr,
			                        		"phone" : app.user.phone[ix],
			                        		"macIdNum" : app.user.macIdNum[ix],
			                        		"iclass" : app.user.iclass[ix],
			                        		"gradYear" : app.user.gradYear[ix],
			                        		"hash" : hash
			                        	}, function (err, newUser) {
			                        		if (err) {res.send('error');} else {
			                        			console.log('created new user, id: ' + newUser[0]._id);
			                        			showColl.update({
			                        				"showTitle" : app.show.showTitle,
			                        				"blurb" : app.show.blurb,
			                        				"timeslot" : 9999
			                        			}, {$push: {hostId: newUser[0]._id} },
			                        			{upsert: true}, function (err, shw) {
			                        				console.log('added *new* user to show. here is the show: ');
			                        				console.log(shw);
			                        				next1();
			                        			});	//	end showColl.update
			                        		}	//	end if/else error
			                        	});	//	end userColl.insert cb
			                        });	//	end bcrypt.hash
								}	//	end user exists else
							}	//	end err if/else
						});	//	end userColl.find
					}	//	end if usr non-null
				}).then( function() {
					console.log('async2 done');	
					next();	//	next application
				});
			}	//	end err if/else
		});	//	end appColl.find
	}).then( function() {
		console.log('all done!');
		res.send('http://localhost:3000/admin/users');
	});

});	//	end router.post