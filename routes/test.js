var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var dbUrl = require('../modulus.js');
var db = mongo.db(dbUrl.modulusConnection, {native_parser:true});
var djApp_coll = db.collection('djApps');
var user_coll = db.collection('users');
var show_coll = db.collection('shows');
var artist_coll = db.collection('artists');

//var collections = [db.collection('djApps')]

router.get('/', function(req, res) {
	djApp_coll.find().toArray(function (err, items) {
			if (err) {
				console.log('error: ' + err)
			} else {
				//res.json(items)
				res.render('test/test', 
					{
						title: 'testing!! fun!!',
						'appItems' : items
						//hey!!
					}
				);
				console.log(items);
			}
	});

	user_coll.find().toArray(function (err, items) {
			if (err) {
				console.log('error: ' + err)
			} else {
				//res.json(items)
				res.render('test/test', 
					{
						title: 'testing!! fun!!',
						'userItems' : items
						//hey!!
					}
				);
				console.log(items);
			}
	});

	show_coll.find().toArray(function (err, items) {
			if (err) {
				console.log('error: ' + err)
			} else {
				//res.json(items)
				res.render('test/test', 
					{
						title: 'testing!! fun!!',
						'showItems' : items
						//hey!!
					}
				);
				console.log(items);
			}
	});

	artist_coll.find().toArray(function (err, items) {
			if (err) {
				console.log('error: ' + err)
			} else {
				//res.json(items)
				res.render('test/test', 
					{
						title: 'testing!! fun!!',
						'artistItems' : items
						//hey!!
					}
				);
				console.log(items);
			}
	});

});






module.exports = router;