var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var bcrypt = require('bcrypt-nodejs');

var nodemailer = require('nodemailer');
var mailingCredentials = require('../nodemailerConfig.js'); 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: mailingCredentials
});


var dbUrl = require('../dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var appColl = db.collection('djapps');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');

var login = require('./login.js');

var forEachAsync = require('forEachAsync').forEachAsync;

router.post('/applicants/dj', function(req, res) {
	var approved = req.body.data;
	console.log(approved);

	//	loop over each application
	forEachAsync(approved, function (next, application, index, array) {
		appColl.findById(application, function (err, app) {
			if (err) {res.send('error');} else {
				console.log(app.user.email + ': email');

				forEachAsync(app.user.email, function (next1, usr, ix, arr) {
					var newUser = true;
					var user2Append;
					if (usr != '') {
						userColl.find({email: usr}).toArray(function (err, result) {
							if (err) {res.send('error');} else {
								console.log('result: ' + result);
								if (result.length) {
									console.log('length!');
									newUser = false;
									user2Append = result[0]._id;
								}
							}
						});
						console.log(usr, ix);	
						console.log(app.user.firstName[ix]);
						console.log('newUser : ' + newUser);
						console.log('2append: ' + user2Append);

						var pass = randomString(10, alphanumeric);
						console.log(pass);
						var mailOptions = {
                            from: 'WMCN noreply <wmcn@macalester.edu>', // sender address
                            to: usr, // list of receivers
                            subject: 'WMCN Login info', // Subject line
                            // text: 'Hello world ✔', // plaintext body
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
                        			console.log('new user id: ' + newUser[0]._id);
                        			showColl.update({
                        				"showTitle" : app.show.showTitle,
                        				"blurb" : app.show.blurb,
                        				"timeslot" : 9999
                        			}, {$push: {hostId: newUser[0]._id} },
                        			{upsert: true}, function (err, shw) {
                        				console.log(shw);
                        			});	//	end showColl.update
                        		}	//	end if/else error
                        	});	//	end userColl.insert cb
                        });	//	end bcrypt.hash
					}
					next1();
				}).then( function () {
					next();
					console.log('async 2 done!');
				});
			} //	end appColl error if/else
		}); //	end appColl.find

	}).then( function () {
		console.log('all done!');
		res.send('http://localhost:3000/admin/users');
	}); //	end forEachAsync(approved)
});