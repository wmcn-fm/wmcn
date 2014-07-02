var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');


/** 
*   ====================================================================
*   '/dj'
*/

//  GET
router.get('/dj', function(req, res) {
    res.render('dj/main', {title: "dj home" })
});



/*
*   '/dj/login'
*/

//  GET
router.get('/dj/login', function(req, res) {
    res.render('dj/login', {title: "dj login" })
});


/*
*   '/dj/user'
*/

//  GET
router.get('/dj/user', function(req, res) {
    res.render('dj/user', {title: "edit user" })
});



/*
*   '/dj/post'
*/

//  GET
router.get('/dj/post', function(req, res) {
    res.render('dj/post', {title: "make a post" })
});

module.exports = router;