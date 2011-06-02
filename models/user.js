var session = require('./session.js')

var user = {
}

function valid(u) {
	//check if user exists
	//TODO: write actual thing.
	console.log('validating user: '+ u);
	if (u) {
		if(u.name!="" && u.password!="") {
			if (u.name === "karlherler" && u.password === "cake") {
				return true
			}
		} 
	}
	return false;
}
function signIn(req, res, next) {
	if (valid(req.body.user)) {
		console.log('gets here')
		user = req.body.user;
		session.create(user);
		req.signedIn = true;
	} else {
		req.signedIn = false;
	}
	next();
}
function signOut(req, res, next) {
	user = "";
	session.destroy();
	next();
}
function create(req, res, next) {
	next();
}
function destroy(req, res, next) {
	next();
}

function validateSession(req, res, next) {
	session.validate(user.name)
	next();
}
exports.session 	= session; //the child model.
exports.signIn 		= signIn;
exports.signOut		= signOut;
exports.create 		= create;
exports.destroy 	= destroy;

exports.validateSession = validateSession;