// route middleware to make sure a user is logged in
exports.isLoggedIn = function isLoggedIn(req, res, next) {
console.log("here is the user: ", req.user)
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		return next();
	}

	// if they aren't redirect them to the login page
	res.redirect('/login');
}

// custom middleware for providing accesslevel restrictions to certain pages
exports.accessClearance = function accessClearance (accessLevel) {
	return function (req, res, next) {
	if (req.user.access >= accessLevel) {
		return next();
	}

	return res.send('access level insufficient')
	}
}

