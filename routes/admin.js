var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var async = require('async');

var dbUrl = require('../modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});
var appColl = db.collection('djapps');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');

var forEachAsync = require('forEachAsync').forEachAsync;

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
            //  alternate async layout
//  POST

router.post('/applicants/dj', function(req, res) {
    var approved = req.body.data;

    forEachAsync(approved, function (next, user, index, array) {
        console.log(user);
        appColl.findById(user, function (err, doc) {
            if (err) {console.log(err + ' error');} else {
                console.log(doc._id + ' id');
                next();
            }
        });
    }).then(function () {
        console.log('all done');
        res.send('http://localhost:3000/admin/users');
    });

});


//  POST
router.post('/applicants/djx', function(req, res) {
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
                                        // res.redirect('http://localhost:3000/admin/users');
                                    }
                                }); //  update usercoll
                     
                            }   // showColl.
                        })  //  showColl.insert
                        
                    }   //  usercoll insert callback else
                }); //  userColl.insert
                
            }   //  appcoll insert callback else
        }); //appColl.findById
    }   // for
    res.send('http://localhost:3000/admin/users');
}); // post 

router.get('/applicants/staff', function(req, res, next) {
    res.render('admin/applicants/staff-applicants', {title: "staff Applications" })
});



/**
*   '/admin/users'
*/

//  GET
router.get('/users', function(req, res) {
    userColl.find().toArray(function (err, items) {

        if (err) { 
          console.log(err + ': err');
        } 

        else {
            var userlist = [];

            forEachAsync(items, function (next1, dj, index, array) {
              
              showColl.find({hostId: dj._id}).toArray(function (err, shows) {
                    if (err) {console.log('showFind error: ' + err);} else {

                        forEachAsync(shows, function (next2, show, index, array) {
                            userlist.push(
                                {
                                   _id: dj._id,
                                   access: dj.access,
                                   firstName: dj.firstName,
                                   lastName: dj.lastName,
                                   gradYear: dj.gradYear,
                                   shows: show.showTitle,
                                   show_id: show._id
                                }
                            );
                            // console.log("I pushed an item!")
                            // console.log("THis is the dj after push: ", dj);

                            next2();
                        }).then(function () {
                            console.log("Why can't I break out of this loop????????????????????");
                            next1();
                        }); // end shows loop
                       
                    }
                    
                }); // end showColl.find
              
            }).then( function() {
                console.log('Everything is done now!');
                // res.send(userlist);
                if (userlist.length !== items.length) {
                    console.log('length discrepancy');
                }

                console.log(userlist.length + ': ul ' + items.length + ': il');
                res.render('admin/users/manageUsers', {
                    "userlist" : userlist,
                    title: 'view users'
                });
            }); // end for TOP LEVEL Each Async
        } // end if/else
    }); // end userColl.find callback
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