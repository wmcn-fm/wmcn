var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var async = require('async');

var dbUrl = require('../modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});
var appColl = db.collection('djapps');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');

/** 
*   ====================================================================
*   '/admin'
*/

// GET
router.get('/*', function(req, res, next) {
	res.set('private content');
	next();
})



/** 
*   '/admin/applicants'
*/

//  GET
router.get('/applicants/dj', function(req, res) {
		
		var collection = db.collection('djapps');

		collection.find().toArray(function (err, items) {
				if (err) {
						res.send('error: ' + err)
				} else {
						res.render('admin/applicants/dj-applicants', {
								"applicants" : items,
								title: 'dj applications'
						});
				}
		});
});

//  POST
router.post('/applicants/dj', function(req, res) {
		var approved = req.body.data;   //  array of _id strings

		//  iterate over each item in the array
		for (var i=0; i<approved.length; i++) {
				var idString = approved[i];

				//  find app doc
				appColl.findById(idString, function (err, doc) {

						if (err) {console.log(err + ' error');} else {
								var appId = doc._id;
								var newShowTitle = doc.show.showTitle;
								var newShowBlurb = doc.show.blurb;

								//  copy all but _id fields to main database
								userColl.insert({
										"access": 1,
										"firstName" : doc.user.firstName,
										"lastName" : doc.user.lastName,
										"email" : doc.user.email,
										"phone" : doc.user.phone,
										"studentStatus" : doc.user.studentStatus,
										"macIdNum" : doc.user.macIdNum,
										"iclass" : doc.user.iclass,
										"gradYear" : doc.user.gradYear
								}, function (err, newUser) {

										if (err) {console.log(err + ' userInsert error');} else {
												var newUserId = newUser[0]._id;

												//  create a new show document with a reference to host
												showColl.insert({
														"showTitle" : newShowTitle,
														"blurb" : newShowBlurb,
														"hostId" : newUserId
												}, function (err, newShow) {

														if (err) {console.log(err + ' : insert show error');} else {
																var newShowId = newShow[0]._id;

																//  update the new user doc with a reference to the new show
																userColl.update({_id:mongo.helper.toObjectID(newUserId)}, 
																{'$set':
																		{
																				showId: newShowId
																		}
																}, function (err, updatedUser) {

																		if (err) {console.log(err + ': updatew/showID err');} else {

																				//  delete the old appColl entry
																				appColl.removeById(appId, function (err, result) {
																						if (err) {console.log(err + ' error removeById');} else {

																						}
																				}); //  removeById
																		}
																}); //  update usercoll
										 
														}   // showColl.
												})  //  showColl.insert
												
										}   //  usercoll insert callback else
								}); //  userColl.insert
								
						}   //  appcoll insert callback else
				}); //appColl.findById
		}   // for
		res.redirect('http://localhost:3000/admin/users');
}); // post 

router.get('/applicants/staff', function(req, res, next) {
		res.render('admin/applicants/staff-applicants', {title: "staff Applications" })
});



/**
*   '/admin/users'
*/

//  GET

// router.get('/users', function(req, res) {
//     userColl.find().toArray(function (err, items) {
//         if (err) {console.log(err + ': err');} else {
//             var userlist = [];

//             items.forEach(function (dj) {

//                 showColl.find({hostId: dj._id}).toArray(function (err, shows) {
//                     if (err) {console.log('showFind error: ' + err);} else {uyi

//                         shows.forEach( function (show) {
//                             userlist.push(
//                                 {
//                                    _id: dj._id,
//                                    access: dj.access,
//                                    firstName: dj.firstName,
//                                    lastName: dj.lastName,
//                                    gradYear: dj.gradYear,
//                                    shows: show.showTitle,
//                                    show_id: show._id
//                                 }  
//                             );
//                             console.log(JSON.stringify(userlist) + ' ul');
//                             res.render('admin/users/manageUsers', {
//                                 "userlist" : userlist,
//                                 title: 'view users'
//                             });
//                             //  SPOT #2
//                         }); //  end shows loop
//                     }
//                 }); // end showColl.find
//             }); //  end items.forEach

//         }   // end if/else      
//     }); // end userColl.find callback   
// });


router.get('/users', function(req, res) {
				userColl.find().toArray(function (err, items) {
								if (err) { 
												console.log(err);
								} 

								else {
												//console.log(items);
												showColl.find({hostID: dj._id}).toArray(function (err, shows) {
																if (err) {
																				throw err;
																} else {
																				shows.forEach( function (show) {
																								userlist.push({
																												_id: dj._id,
																										 access: dj.access,
																										 firstName: dj.firstName,
																										 lastName: dj.lastName,
																										 gradYear: dj.gradYear,
																										 shows: show.showTitle,
																										 show_id: show._id
																								}); // end push
																				}); // end forEach

																				res.render('admin/users/manageUsers', {
																								"userlist" : userlist
																				});
																}
												}); // end showColl.find
								}
				})
});



/**
*   '/admin/users/:id'
*/

//  GET
router.get('/users/:id', function(req, res) {
		var id = req.params.id;

		userColl.findById(id, function (err, result) {
				if (err) {
						console.log('error bitch');
				} else {
						console.log('result '+ result);
						res.render('admin/users/editUser', {
								title: 'Edit Account',
								"userInfo": result
						});
				}
		});
});

//  POST
router.post('/updateUser', function(req, res) {

		var userId =  mongo.helper.toObjectID(req.body.userId);
		var djStatus = req.body.djStatus;
		var access = req.body.access;
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var phone = req.body.phone;
		var studentStatus = req.body.studentStatus;
		var macIdNum = req.body.macIdNum;
		var iclass = req.body.iclass;
		var gradYear = req.body.gradYear;
		var show = req.body.show;
		var blurb = req.body.blurb;

		userColl.update(
				{_id: userId},
				{'$set':
						{
								djStatus: djStatus,
								access: access,
								firstName: firstName,
								lastName: lastName,
								email: email,
								phone: phone,
								studentStatus: studentStatus,
								macIdNum: macIdNum,
								iclass: iclass,
								gradYear: gradYear,
								show: show,
								blurb: blurb
						}
				}, function (err, doc) {
						if (err) {
								res.send('there was a problem updating' + err);
						} else {
								console.log(doc + ' doc');
								res.location('users');
								res.redirect('users');
						}
				}); 
});

//  DELETE
router.delete('/deleteuser/:id', function(req, res) {
		var userToDelete = req.params.id;

		userColl.removeById(userToDelete, function(err, result) {
				//res.send((result === 1) ? {msg : ''} : {msg:'error: ' + err});
				if (err) {
						res.send('error: ' + err)
				} else {
						res.send('')
						//res.location('admin/users');
						//res.redirect('admin/users');
				}
		});
});





/**
*   '/admin/scheduler'
*/

//  GET
router.get('/scheduler', function(req, res) {
		res.render('admin/scheduler', {title: 'schedule creator'})
});



/**
*   '/admin/site'
*/

//  GET
router.get('/site', function(req, res) {
		res.render('admin/site', {title: 'site config'})
});

module.exports = router;