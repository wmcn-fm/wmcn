var user1 = {
			uniqueID: 0,
			access : 0,
			name : {
				first : '',
				last : ''
			},
			contact : {
				phone : 0,
				email : '',
			},
			student : {
			z	status: true,
				id : 0,
				iclass : 0,
				year : 0,
			}	
		
	};

//express setup
var express = require('express');
var app = express();

//mongodb setup - retrieve
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('test', new Server('locahost', 27017), {safe: false});

db.createCollection('test', {w:1}, function(err, collection) {
	var collection = db.collection("test");
	collection.insert({hello:'word_yes_yes'});
	console.log(collection);
	db.close();
});
// Fetch a collection to insert document into
db.open(function(err, db) {
  var collection = db.collection("simple_document_insert_collection_no_safe");
  // Insert a single document
  collection.insert({hello:'world_no_safe'});

  // Wait for a second before finishing up, to ensure we have written the item to disk
  setTimeout(function() {

    // Fetch the document
    collection.findOne({hello:'world_no_safe'}, function(err, item) {
      assert.equal(null, err);
      assert.equal('world_no_safe', item.hello);
      db.close();
    })
  }, 100);
});


// //get requesto
// app.get('/', function(req, res){
//         res.send(MongoClient.toString());	
// });
// 
// 
// 
// var server = app.listen(3000, function() {
//     console.log('Listening on port %d', server.address().port);
// });
