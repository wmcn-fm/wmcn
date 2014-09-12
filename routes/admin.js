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
router.get('/*', login.isLoggedIn, function(req, res, next) {
	res.set('private content');
	next();
});

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

    forEachAsync(approved, function (next, user, index, array) {

        // find the application document (doc)
        appColl.findById(user, function (err, doc) {
            if (err) {console.log(err + ' error');} else {
                console.log(doc);
                var appId = doc._id;
                var newShowTitle = doc.show.showTitle;
                var newShowBlurb = doc.show.blurb;

                var pass = randomString(10, alphanumeric);
                // PUT NODEMAILER STUFF HERE AND SEND TO ADDRESS doc.user.email
                var mailOptions = {
                    from: 'WMCN <wmcn@macalester.edu>', // sender address
                    to: doc.email, // list of receivers
                    subject: 'You have been approved!', // Subject line
                    // text: 'Hello world ✔', // plaintext body
                    html: '<b>This is a WMCN test email</b>' +
                          '<p> This is your temporary password: ' + pass + '</p>' +
                          '<p> your name is: ' + doc.firstName +'</p>'
                }

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                    }
                });

                //  create a new dj doc with app credentials (newUser)
                bcrypt.hash(pass, null, null, function (err, hash) {
                    userColl.insert({
                        "access" : 1,
                        "firstName" : doc.user.firstName,
                        "lastName" : doc.user.lastName,
                        "email" : doc.user.email,
                        "phone" : doc.user.phone,
                        "macIdNum" : doc.user.macIdNum,
                        "iclass" : doc.user.iclass,
                        "gradYear" : doc.user.gradYear,
                        hash : hash
                    }, function (err, newUser) {
                        if (err) {console.log(err + ' userColl insert err')} else {
                            var newUserId = newUser[0]._id;

                            //  create a new show doc with a reference to newUser
                            showColl.insert({
                                "showTitle" : newShowTitle,
                                "blurb" : newShowBlurb,
                                "hostId" : newUserId
                            }, function (err, newShow) {
                                if (err) {console.log(err + ' showColl insert error')} else {
                                    var newShowId = newShow[0]._id;

                                    //  tack the new show id to the new user
                                    userColl.update({_id:mongo.helper.toObjectID(newUserId)},
                                        {'$set': {showId: newShowId}},
                                        function (err, updatedUser) {
                                            if (err) {console.log(err + ' updateuser error')} else {

                                                appColl.removeById(appId, function (err, result) {
                                                    if (err) {console.log(err + ' removeApp err')} else {               
                                                        next();
                                                    }
                                                }); //  end appColl.removeByID
                                            }
                                        }
                                    );  //  end userColl.update
                                }
                            }); //  end showColl.insert
                        }   
                    }); //  end userColl.insert;
                }); //   end bcrypt hash
            }
        }); //  end appColl.findById;
    }).then(function () {
        console.log('all done');
        res.send('http://localhost:3000/admin/users');
    });
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