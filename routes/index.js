var express = require('express');
var router = express.Router();

var Playlists = require('../models/Playlists');
var api = require('../models/utils');

/* GET home page. */
router.get('/', function(req, res) {
  api.get('/playlists/', function(err, result, statusCode) {
    if (err) console.log('error:\n', err);

    console.log('result\t', result);

    res.render('index', { 
      title: 'WMCN 91.7fm | Macalester College Radio',
      playlists: result.playlists,
    });

  });
  
});

module.exports = router;
