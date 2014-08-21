// mostly used code from 
// http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local

// PURPOSE: This file configures passport and authentication strategies
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var mongo = require('mongoskin');
var dbUrl = require('./dbLogin.js');
var db = mongo.db(dbUrl, {native_parser:true});
var appColl = db.collection('djapps');
var userColl = db.collection('usercollection');
var showColl = db.collection('shows');

// notes: might have to use user._id instead of user.id

module.exports = function(passport) {

	// =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // Passport session setup.
	// To support persistent login sessions, Passport needs to be able to
	// serialize users into and deserialize users out of the session. 
	// Typically, this will be as simple as storing the user ID when serializing, and finding
	// the user by ID when deserializing.
	console.log("attempt at configuring passport happened");

  // destorys database session, is called when the session is done.
	passport.serializeUser( function (user, done) {
    console.log("this is the user.id: ", user._id)
	  done(null, user._id);
	});

  // takes data from database, id has been SERIALIZED by passport.serializeUser
  // id is WHATEVER is in the second argument of done() in passport.serializeUser
	passport.deserializeUser(function (id, done) {
		userColl.findById(id, function (err, user) {
				console.log("deserializing....this is the id: ", id);
				// the user object gets attached to the request (as req.user) if this works correctly
				// can be named something other than user if you want to set a var
        done(err, user); 
    });
  }); // end passport.deserializeUser

	// =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
	}, function (req, email, password, done) {

			// asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick( function() {
      	// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
        userColl.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
            	return done(err);
	          }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {


            	// ALL THIS NEEDS TO BE INSIDE A BCRYPT CALLBACK

				// // if there is no user with that email
    //             // create the user
    //             var newUser            = new User();

    //             // set the user's local credentials
    //             newUser.local.email    = email;
    //             newUser.local.password = newUser.generateHash(password);

				// // save the user
    //             newUser.save(function(err) {
    //                 if (err)
    //                     throw err;
    //                 return done(null, newUser);
    //             }); // end newUser.save
            } // end if/else
        }); 
      }); // end process.nextTick
	}) // end LocalStrategy & callback
	); // end LOCAL-SIGNUP

	// =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) { // callback with email and password from our form

	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
      userColl.findOne({ 'email' :  email }, function (err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
              return done(null, false, req.flash('loginMessage', 'Email and password combination not found.')); // req.flash is the way to set flashdata using connect-flash
					
          bcrypt.compare(password, user.hash, function (err, result) {
            if (err) { console.error("bcrypt err in password comparison") }
            // user is found but the password is wrong
            if (!result) {
              // create the loginMessage and save it to session as flashdata
              return done(null, false, req.flash('loginMessage', 'Email and password combination not found.'));
            } else {
              // all is well, return successful user
              return done(null, user);
            }

          }); // end bcrypt.compare          
      });

  }));
} // end module.exports 