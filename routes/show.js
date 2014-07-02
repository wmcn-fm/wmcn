var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');


/** 
*   ====================================================================
*   '/show'
*/

//  GET
router.get('/:id', function(req, res) {
    var id = req.params.id;
    res.render('show/viewShow', {title: "dj home: " + id })
});

module.exports = router;