var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var db = mongo.db("mongodb://localhost:27017/test", {native_parser:true});
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
					}
				);
				console.log(items);
			}
	});

});






module.exports = router;