var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WMCN: Macalester College Radio' });
});

/* GET dj app page. */
router.get('/dj-application', function(req, res) {
  res.render('djApp', { title: 'Apply to Be a DJ!'});
});

/* GET staff app page. */
router.get('/staff-application', function(req, res) {
  res.render('staffApp', { title: 'Apply for a WMCN Staff Position' })
});

/* GET archive page. */
router.get('/archive', function(req, res) {
	res.render('archive', {title: "Show Archive" })
});

/* GET playlist creator. */
router.get('/post/playlist', function(req, res) {
	res.render('createPlaylist', {title: "Create a Playlist" })
});

/* GET post creator. */
router.get('/post/other', function(req, res) {
	res.render('createPost', {title: "Create a post" })
});

/* GET admin manager. */
router.get('/admin', function(req, res) {
	res.render('adminLanding', {title: "Manage useres" })
});

/* GET scheduler . */
router.get('/admin/scheduler', function(req, res) {
	//res.render('scheduler', {title: "Create a schedule"
	var db = req.db;
	var collection = db.collection('usercollection');
	collection.find({},{}, function(e, docs) {
		res.render('scheduler', {
			"userlist": docs
		});
	})
});





module.exports = router;