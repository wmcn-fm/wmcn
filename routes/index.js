var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'WMCN 91.7fm | Macalester College Radio' });
});

module.exports = router;
