var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

var login = require('./login.js');


/** 
*   ====================================================================
*   '/show'
*/

//  GET

router.get('/*', login.isLoggedIn, function(req, res, next) {
	res.set('private content');
	next();
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    res.render('show/viewShow', {title: "dj home: " + id })
});

module.exports = router;