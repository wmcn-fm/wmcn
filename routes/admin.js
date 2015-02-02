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

/** 
*   ====================================================================
*   '/admin'
*/

// GET
// router.get('/*', login.isLoggedIn, function(req, res, next) {
// 	res.set('private content');
// 	next();
// });

router.get('test-schedule', function(req, res) {
    res.render('admin/dummy-schedule', {
        title: 'test schedule'
    });
});

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
    console.log(approved);

    //  loop over each application
    forEachAsync(approved, function (next, appArray, index, array) {
        // console.log('array:', appArray);
        var application = appArray[0];
        var timeslot = parseInt(appArray[1]);
        // console.log('application', application, 'timeslot', timeslot);

        appColl.findById(application, function (err, app) {
            if (err) {res.send('error');} else {
                console.log(app.user.email + ': email');

                //  loop over each user email w/in application
                forEachAsync(app.user.email, function (next1, usr, ix, arr) {
                    if (usr != '') {
                        console.log(usr, ix);   
                        console.log(app.user.firstName[ix]);


                        userColl.find({email: usr}).toArray( function (err, result) {
                            if (result.length != 0) {
                                console.log(usr + ' user exists!! ::::');
                                console.log(result[0]);
                                var djId = result[0]._id;
                                console.log('new dj id: ' + djId);

                                showColl.find({showTitle: app.show.showTitle}).toArray( function (err, show) {
                                    if (err) {console.log(err);} else {

                                        //  if show already exists, only update timeslot
                                        if (show.length != 0) {
                                            console.log(show, 'show already exists!');
                                            showColl.update({showTitle: app.show.showTitle}, {$set: {timeslot: timeslot}}, function (err, updatedShow) {
                                                if (err) {console.log(err);} else {
                                                    console.log(updatedShow, 'updatedshow');
                                                    console.log('user updated w/showId: ' +  updatedShow._id, 'w timeslot:', updatedShow.timeslot);
                                                    next1();  
                                                }
                                                
                                            });
        
                                        //  if the user exists but show does not,
                                        //  add a new doc for the show and add 1-1 link to the user
                                        } else {
                                            //  link show doc to new user...
                                            showColl.update({
                                                "showTitle" : app.show.showTitle,
                                                "blurb" : app.show.blurb,
                                                "timeslot" : timeslot
                                            }, {$addToSet: {hostId: result[0]._id} }, {upsert: true}, function (err, shw) {
                                                console.log('added old Dj: ' + result[0].email + ' to show ' + shw);
                                                showColl.find({showTitle: app.show.showTitle}).toArray(function (err, newShow) {
                                                    console.log('new show title: ' + newShow[0].showTitle + ' _id: ' + newShow[0]._id + 'timeslot: ' + newShow[0].timeslot);
                                                    var newShowId = newShow[0]._id;
                                                    //  ...and vice versa
                                                    userColl.update({_id:djId}, {$addToSet: {
                                                        shows: newShowId
                                                    }}, function (err, newUser) {
                                                        console.log('user updated w/showId: ' +  newUser);
                                                    });
                                                });
                                                next1();
                                            }); //  end showColl.update

                                        }   //  end else show exists
                                    }   //  end err if/else
                                }); //  end showColl.find

                                
                            } else {
                                var pass = randomString(10, alphanumeric);
                                console.log(pass);
                                var mailOptions = {
                                    from: 'WMCN noreply <wmcn@macalester.edu>', // sender address
                                    to: usr, // list of receivers
                                    subject: 'WMCN.fm Login info', // Subject line
                                    // text: 'Hello world ✔', // plaintext body
                                    html: //'<b>This is a WMCN test email</b>' +
                                          '<p> Hi ' + app.user.firstName[ix] +',</p>' +  
                                          '<p>Welcome to WMCN! Here is your login info for the website (wmcn.fm/login): </p>' +                                            
                                          '<p> Login email: ' + usr + '</p>' +
                                          '<p> Password: ' + pass + '</p>' +
                                          '<p> You will be able to change your password in the near future. ' +
                                          'However, the site is being built on the fly so it could take a couple of weeks. Until then, remember this temporary password. Thanks for your patience. </p>' +
                                          '<p> Your show is: ' + app.show.showTitle + '</p>' +
                                          '<p> Remember to create a playlist each time you broadcast a show (even non-music based shows must do this). ' + 
                                          'After signing in, you can create a playlist at wmcn.fm/dj/playlist.</p>' +
                                          '<p> If you have any technical problems with the site - logging in, creating a playlist, etc - <b> do not </b> reply to this email. ' +
                                          'Instead, send a new message to wkentdag@macalester.edu with "WMCN website issue" in the subject line.</p>' +
                                          '<p> Thanks and happy DJing! Love,</p>' +
                                          '<p>WMCN</p>'
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
                                        // "gradYear" : app.user.gradYear[ix],
                                        "hash" : hash
                                    }, function (err, newUser) {
                                        if (err) {res.send('error');} else {
                                            console.log('new user id: ' + newUser[0]._id);
                                            showColl.update({
                                                "showTitle" : app.show.showTitle,
                                                "blurb" : app.show.blurb,
                                                "timeslot" : timeslot
                                            }, {$addToSet: {hostId: newUser[0]._id} },
                                            {upsert: true}, function (err, shw) {
                                                // console.log(shw);
                                                showColl.find({showTitle: app.show.showTitle}).toArray(function (err, newShow) {
                                                    console.log('new show title: ' + newShow[0].showTitle + ' _id: ' + newShow[0]._id);
                                                    var newShowId = newShow[0]._id;
                                                    userColl.update({_id:newUser[0]._id}, {$addToSet: {
                                                        shows: newShowId
                                                    }}, function (err, newestUser) {
                                                        console.log('user updated w/showId: ' + newestUser);
                                                    });
                                                });
                                                next1();
                                            }); //  end showColl.update
                                        }   //  end if/else error
                                    }); //  end userColl.insert cb
                                }); //  end bcrypt.hash   
                            }
                        });    
                    } else {
                        next1();
                    }   //  end if non-null
                }).then( function () {
                    next();
                    console.log('async 2 done!');
                });
            } //    end appColl error if/else
        }); //  end appColl.find

    }).then( function () {
        console.log('all done!');
        res.send('http://localhost:3000/admin/users');
    }); //  end forEachAsync(approved)
});



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
                            //console.log("Why can't I break out of this loop????????????????????");
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

// random string generator found on stack overflow
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
//var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
var alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';