var express = require('express');
var router = express.Router();

/**
*	GET for basic urls
**/

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WMCN: Macalester College Radio' });
});

/* GET archive page. */
router.get('/archive', function(req, res) {
	res.render('archive', {title: "Show Archive" })
});

/* GET admin manager. */
router.get('/admin', function(req, res) {
	res.render('adminLanding', {title: "Manage useres" })
});

/* GET dj app page. */
router.get('/dj-application', function(req, res) {
  res.render('djApp', { title: 'Apply to Be a DJ!'});
});

/* GET staff app page. */
router.get('/staff-application', function(req, res) {
  res.render('staffApp', { title: 'Apply for a WMCN Staff Position' })
});

/* GET playlist creator. */
router.get('/post/playlist', function(req, res) {
	res.render('createPlaylist', {title: "Create a Playlist" })
});

/* GET post creator. */
router.get('/post/other', function(req, res) {
	res.render('createPost', {title: "Create a post" })
});

/**
*	POST
**/

// POST dj app
router.post('/dj-application', function(req, res) {
	res.send('You submitted: ' + req.body.firstName)
});


/**
*	admin login credentialing
**/

// router.get('/admin/*', function(req, res) {
// 	res.render('login', { title: "Login"});
// })

// router.get('/admin/scheduler', function(req, res) {
//     var db = req.db;
//     db.collection('userlist').find().toArray(function (err, items) {
//         res.json(items);
//     });
// });



module.exports = router;