var express = require('express');
var bcrypt = require('bcrypt-nodejs');


bcrypt.hash('wmcn917', null, null, function (err, hash) {
	console.log(hash);
})