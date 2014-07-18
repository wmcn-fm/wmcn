var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var dbUrl = require('../modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});
var appColl = db.collection('djapps');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');
var forEachAsync = require('forEachAsync').forEachAsync;


//remember, each item is a dj
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
                            console.log("I pushed an item!")
                            console.log("THis is the dj after push: ", dj);
                            // SPOT #2
                            next2();
                        }).then(function () {
                          console.log("Why can't I break out of this loop????????????????????");
                          // res.render('admin/users/manageUsers', {
                          //         "userlist" : userlist,
                          //         title: 'view users'
                          //     });
                          next1();
                        }); // end shows loop
                       
                    }
                    
                }); // end showColl.find
              
            }).then( function() {
              console.log('Everything is done now!');
              // res.send(userlist);
              if (userlist.length === items.length) {
                console.log(userlist.length + ': ul ' + items.length + ': il');

                console.log(JSON.stringify(userlist) + ' ul');
                res.render('admin/users/manageUsers', {
                    "userlist" : userlist,
                    title: 'view users'
                });
                // forEachAsync(array, function(next3, itemInArray) { console.log(itemInArray);})
            }
            }); // end for TOP LEVEL Each Async

    //         items.forEach(function (dj) {
    //             console.log("This is immediately inside the items.foreach");
                // showColl.find({hostId: dj._id}).toArray(function (err, shows) {
                //     if (err) {console.log('showFind error: ' + err);} else {

                //         shows.forEach( function (show) {
                //             userlist.push(
                //                 {
                //                    _id: dj._id,
                //                    access: dj.access,
                //                    firstName: dj.firstName,
                //                    lastName: dj.lastName,
                //                    gradYear: dj.gradYear,
                //                    shows: show.showTitle,
                //                    show_id: show._id
                //                 }
                //             );
                //             console.log("is this if block working")
                //             if (userlist.length === items.length-5) {
                //               res.render('admin/users/manageUsers', {
                //                   "userlist" : userlist,
                //                   title: 'view users'
                //               });
                //             }
                //             // SPOT #2
                //         }); // end shows loop
                //         //console.log(userlist);
                //     }
                // }); // end showColl.find

    //         }, function () {console.log("whats up")}); // end items.forEach
    //         console.log("does this if block even work?")
    //         console.log("the forEach might all be done, but showColl.find isn't")
    //         // if (userlist.length === items.length) {
    //         //     console.log(userlist.length + ': ul ' + items.length + ': il');

    //         //     console.log(JSON.stringify(userlist) + ' ul');
    //         //     res.render('admin/users/manageUsers', {
    //         //         "userlist" : userlist,
    //         //         title: 'view users'
    //         //     });
    //         // }

            
        } // end if/else
    }); // end userColl.find callback
});

module.exports = router;