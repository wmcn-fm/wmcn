var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var dbUrl = require('../modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});

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

    function insertAndRemove(obj, oldColl, newColl) {
        console.log('insertremove');
        console.log(obj + ' o');
        for (var key in obj) {
            var attrName = key;
            var attrVal = obj[key]
            console.log(attrName + ': ' + attrValue);
        }
        // newColl.insert({
        //     "djStatus": obj.djStatus,
        //     "access": 1,
        //     "firstName" : obj.firstName,
        //     "lastName" : obj.lastName,
        //     "email" : obj.email,
        //     "phone" : obj.phone,
        //     "studentStatus" : obj.studentStatus,
        //     "macIdNum" : obj.macIdNum,
        //     "iclass" : obj.iclass,
        //     "gradYear" : obj.gradYear,
        //     "show" : obj.show,
        //     "blurb" : obj.blurb
        // }, function (err, newUser) {
        //     if (err) {
        //         console.log(err + ' addToUsers error');
        //         return false;
        //     } else {
        //         console.log(newUser);
        //         return true;
        //     }   
        // });
    }

    function getAppDoc(id) {    //  returns doc
        var applicant;
        appColl.findById(id, function (err, doc) {
            if (err) {
                return err + ' getApps error';
            } else {
                return doc;
            }
        });
    }

    var appColl = db.collection('djapps');
    var userColl = db.collection('usercollection');
    var approved = req.body.data;   //  array of _id strings

    //  for each item in the array
    for (var i=0; i<approved.length; i++) {
        //  find the document associated with the id
        insertAndRemove(getAppDoc(approved[i]), appColl, userColl);
    }


    // var apps2move = getApps(approved);
    // console.log(approved + 'approved');


/*
    //  iterate over each application in the array
    for (var i=0; i<approvedApps.length; i++) {
        var applicant = approvedApps[i];

        //  find the application in the apps coll
        appColl.findById(applicant, function (err, doc) {
            if (err) {
                console.log('error on' + applicant + 'i: ' + i);
            }
            else {
                //console.log('doc ' + doc._id);  //app collection _id
                //console.log('doc ' + doc.firstName);
                userColl.insert({
                    "djStatus": doc.djStatus,
                    "access": 1,
                    "firstName" : doc.firstName,
                    "lastName" : doc.lastName,
                    "email" : doc.email,
                    "phone" : doc.phone,
                    "studentStatus" : doc.studentStatus,
                    "macIdNum" : doc.macIdNum,
                    "iclass" : doc.iclass,
                    "gradYear" : doc.gradYear,
                    "show" : doc.show,
                    "blurb" : doc.blurb
                }, function (err, newUser) {
                    if (err) {
                        console.log('insert error ' + err);
                    } else {

                        deleteApps(userArray)
                        //console.log(JSON.stringify(newUser));
                        console.log(newUser[0]._id);
                        for (var i=0; i<newUser.length; i++ ) {
                            var user = newUser[i];
                            appColl.removeById(user._id, function (err, result) {
                                if (err) {
                                    console.log('error ' + err);
                                } else {
                                    console.log(result + ' result');
                                }
                            });
                        } 
                    }
                });
            }   // else
        }); // appColl.findById
    }   // for
*/
}); // post 

router.get('/applicants/staff', function(req, res, next) {
    res.render('admin/applicants/staff-applicants', {title: "staff Applications" })
});



/**
*   '/admin/users'
*/

//  GET
router.get('/users', function(req, res) {
    var collection = db.collection('usercollection');

    collection.find().toArray(function (err, items) {
        res.render('admin/users/manageUsers', {
        	"userlist" : items,
            title: 'View Database'
        });
	    res.end('testing data');
    });
});



/**
*   '/admin/users/:id'
*/

//  GET
router.get('/users/:id', function(req, res) {
    var id = req.params.id;
    var db = req.db;
    var collection = req.collection;
    console.log('hey hey' + id);
    collection.findById(id, function (err, result) {
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
    var db = req.db;
    var collection = req.collection;

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

    collection.update(
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
    var collection = db.collection('usercollection');
    var userToDelete = req.params.id;
    collection.removeById(userToDelete, function(err, result) {
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