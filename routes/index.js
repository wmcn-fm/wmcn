var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WMCN: Macalester College Radio' });
});

module.exports = router;

/* GET dj app page. */
router.get('/dj-application', function(req, res) {
  res.render('djApp', { title: 'Apply to Be a DJ!'});
});

module.exports = router;

/* GET staff app page. */
router.get('/staff-application', function(req, res) {
  res.render('staffApp', { title: 'Apply for a WMCN Staff Position' })
});