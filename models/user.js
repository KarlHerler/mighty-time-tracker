var session = require('./session.js')
var mongoose = require('mongoose');
//data connection

mongoose.connect('mongodb://localhost:27017/users');
var Schema = mongoose.Schema;
var	ObjectId = Schema.ObjectId;

var Work = new Schema({
	tID 	: ObjectId,
	tags 	: [],
	done	: {type: Boolean, default: false},
	start : {type: Date, 		default: Date.now },
	stop	: Date
});

var user = new Schema({
	uID				: ObjectId,
	name			: String,
	password	: String // should this be string?
});

function validate(req, res, next) {
	//check if field is valid, only for username
	console.log(req.body.name);
	req.data = req.body.name;	//ades
	next();
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
		user = {id: 'ohmanohgodohman', name: req.body.user.name} //should be objId
		req.session.user = user;
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
	console.log(req.body.user.name);
	console.log(req.body.user.password);
	console.log(req.body.user.mail);
	req.data = "cake";
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
exports.validate	= validate;
exports.signIn 		= signIn;
exports.signOut		= signOut;
exports.create 		= create;
exports.destroy 	= destroy;

exports.validateSession = validateSession;