var session = require('./session.js')
var mongoose = require('mongoose');
var crypto = require('crypto');
//data connection

mongoose.connect('mongodb://localhost:27017/users');
var Schema = mongoose.Schema;
var	ObjectId = Schema.ObjectId;

var User = new Schema({
	uID				: ObjectId,
	name			: String,
	password	: String, // should this be string?
	createdOn : Date
});


mongoose.model('User', User)
// retrieve my model
exports.UserInstance = mongoose.model('User');

var UserInstance = mongoose.model('User');




function validate(req, res, next) {
	//check if field is valid, only for username
	UserInstance.find(req.body, ['_id'], function(err, docs) {
		var isAvaliable = true
		if (docs.length>0) { isAvaliable = false; }
		req.data = { isAvaliable: isAvaliable };
		next();
	});
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
	var date = new Date();
	
	//non random salting.
	var salt = crypto.createHash('sha1');
	salt.update("midsommarafton och det regnar. :(")
	salt = salt.digest('hex');
	
	//the actual password hash
	var hash = crypto.createHash('sha256');
	hash.update(salt)
	hash.update(req.body.user.password);
	hash.update(date);
	hash = hash.digest('hex');
	
	var user = new UserInstance({
		name: req.body.user.name,
		password: hash,
		mail: req.body.user.mail,
		date: date
	});
	var objId = user._id;
	user.save(function (err) {
		if (err) { console.log("Could not initiate work: "+err); req.err = err; }
	});
	
	req.data = user;
	
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