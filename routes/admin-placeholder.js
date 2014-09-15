router.post('/applicants/dj', function(req, res) {
    var approved = req.body.data;
    // console.log(approved);

    forEachAsync(approved, function (next, user, index, array) {
        // console.log('user: ' + user);
        // find the application document (doc)
        appColl.findById(user, function (err, doc) {
            if (err) {console.log(err + ' error');} else {
                console.log('printing doc: ===============');
                // console.log(doc);
                console.log(doc.user.email + ',, ' + doc.user.firstName);
                for (var i=0; i<doc.user.email.length; i++) {
                    console.log(i + ': ' + doc.user.email[i]);
                }

                var numDjs = -1;
                //  separate DJ info from app
                for (var i=0; i<doc.user.email.length; i++) {
                    //  weed out null entries
                    if (doc.user.email[i] != '') {
                        numDjs += 1;

                        var appId = doc._id;
                        var newShowTitle = doc.show.showTitle;
                        var newShowBlurb = doc.show.blurb;

                        var firstName = doc.user.firstName[i];
                        console.log(firstName + ': first name');

                        var pass = randomString(10, alphanumeric);

                        var mailOptions = {
                            from: 'WMCN noreply <noreply@wmcn.fm>', // sender address
                            to: doc.user.email[i], // list of receivers
                            subject: 'You have been approved!', // Subject line
                            // text: 'Hello world ✔', // plaintext body
                            html: '<b>This is a WMCN test email</b>' +
                                  '<p> Your login email is: ' + doc.user.email[i] + '</p>' +
                                  '<p> This is your temporary password: ' + pass + '</p>' +
                                  '<p> your name is: ' + doc.user.firstName[i] +'</p>' + 
                                  '<p> your show is: ' + doc.show.showTitlex + '</p>'
                        }

                        console.log(firstName + ': first name ' + i + ' after mailOptions');

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function (error, info){
                            if(error){
                                console.log(error);
                            }else{
                                console.log('Message sent: ' + info.response);
                            }
                        });

                        console.log(firstName + ': first name ' + i + ' after transporter');

                        //  create a new dj doc with app credentials (newUser)
                        bcrypt.hash(pass, null, null, function (err, hash) {
                            userColl.insert({
                                "access" : 1,
                                "firstName" : firstName,
                                "lastName" : doc.user.lastName[i],
                                "email" : doc.user.email[i],
                                "phone" : doc.user.phone[i],
                                "macIdNum" : doc.user.macIdNum[i],
                                "iclass" : doc.user.iclass[i],
                                "gradYear" : doc.user.gradYear[i],
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
                                                        console.log('finished appending show ID to new user: ');
                                                        console.log(updatedUser[0]);
                                                        // appColl.removeById(appId, function (err, result) {
                                                        //     if (err) {console.log(err + ' removeApp err')} else {               
                                                        //         next();
                                                        //     }
                                                        // }); //  end appColl.removeByID
                                                    }
                                                }
                                            );  //  end userColl.update
                                        }
                                    }); //  end showColl.insert
                                }   
                            }); //  end userColl.insert;
                        }); //   end bcrypt hash
                    }   // end if (doc.user.email[i] != null)
                }   // end NEW FOR LOOP
                // console.log(numDjs);
            }   //  end appColl.findById IF
        });
        next();


                // var appId = doc._id;
                // var newShowTitle = doc.show.showTitle;
                // var newShowBlurb = doc.show.blurb;

                // var pass = randomString(10, alphanumeric);
                // // PUT NODEMAILER STUFF HERE AND SEND TO ADDRESS doc.user.email
                // var mailOptions = {
                //     from: 'WMCN <wmcn@macalester.edu>', // sender address
                //     to: doc.user.email, // list of receivers
                //     subject: 'You have been approved!', // Subject line
                //     // text: 'Hello world ✔', // plaintext body
                //     html: '<b>This is a WMCN test email</b>' +
                //           '<p> Your login email is: ' + doc.user.email + '</p>' +
                //           '<p> This is your temporary password: ' + pass + '</p>' +
                //           '<p> your name is: ' + doc.user.firstName +'</p>'
                // }

                // // send mail with defined transport object
                // transporter.sendMail(mailOptions, function (error, info){
                //     if(error){
                //         console.log(error);
                //     }else{
                //         console.log('Message sent: ' + info.response);
                //     }
                // });

                //  create a new dj doc with app credentials (newUser)
                // bcrypt.hash(pass, null, null, function (err, hash) {
                //     userColl.insert({
                //         "access" : 1,
                //         "firstName" : doc.user.firstName,
                //         "lastName" : doc.user.lastName,
                //         "email" : doc.user.email,
                //         "phone" : doc.user.phone,
                //         "macIdNum" : doc.user.macIdNum,
                //         "iclass" : doc.user.iclass,
                //         "gradYear" : doc.user.gradYear,
                //         hash : hash
                //     }, function (err, newUser) {
                //         if (err) {console.log(err + ' userColl insert err')} else {
                //             var newUserId = newUser[0]._id;

                //             //  create a new show doc with a reference to newUser
                //             showColl.insert({
                //                 "showTitle" : newShowTitle,
                //                 "blurb" : newShowBlurb,
                //                 "hostId" : newUserId
                //             }, function (err, newShow) {
                //                 if (err) {console.log(err + ' showColl insert error')} else {
                //                     var newShowId = newShow[0]._id;

                //                     //  tack the new show id to the new user
                //                     userColl.update({_id:mongo.helper.toObjectID(newUserId)},
                //                         {'$set': {showId: newShowId}},
                //                         function (err, updatedUser) {
                //                             if (err) {console.log(err + ' updateuser error')} else {

                //                                 appColl.removeById(appId, function (err, result) {
                //                                     if (err) {console.log(err + ' removeApp err')} else {               
                //                                         next();
                //                                     }
                //                                 }); //  end appColl.removeByID
                //                             }
                //                         }
                //                     );  //  end userColl.update
                //                 }
                //             }); //  end showColl.insert
                //         }   
                //     }); //  end userColl.insert;
                // }); //   end bcrypt hash
        //     }
        // }); //  end appColl.findById;
    }).then(function () {
        console.log('all done');
        res.send('http://localhost:3000/admin/users');
    });
});