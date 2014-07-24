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
	passport.serializeUser(function (user, done) {
    console.log("this is the user.id: ", user.id)
	  done(null, user.id);
	});

  // takes data from database, id has been SERIALIZED by passport.serializeUser
  // id is WHATEVER is in the second argument of done() in passport.serializeUser
	passport.deserializeUser(function (id, done) {
    mySQLDB.query("SELECT * FROM users WHERE id = " +mySQLDB.escape(id)+ " LIMIT 1;",
      function (err, rows) {
        if (err) {
          console.log("mySQLDB.query() for deserializing user, failed!");
        }
        console.log("deserializing....this is the id: ", id);
        console.log("this is the record found: ", rows[0]);
        var userObject = mySQLDB.formatUser(rows);
        done(err, userObject); 
      }//return user object, now it will be accessed in the routes as req.user
    ); //end mySQLDB.query()
  }); // end passport.deserializeUser
}