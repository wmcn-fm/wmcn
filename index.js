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
				status: true,
				id : 0,
				iclass : 0,
				year : 0,
			}	
		
	};

//express setup
var express = require('express');
var app = express();

//mongodb setup
var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users", "shows"]
var db = require("mongojs").connect(databaseUrl, collections);

db.users.insert(user1);
console.log(user1);

//var users = db.users;
//var userLength = users.size();

//get mongo
app.get('/', function(req, res){
        res.send(find);	
});

//query mongo
var find = db.users.find({uniqueID : 0}, function(err, users) {
  if( err || !users) console.log("show title not found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});



var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
