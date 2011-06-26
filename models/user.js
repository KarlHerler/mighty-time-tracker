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


// Helpers
function hash(s, date) {
	//non random salting.
	var salt = 'b1e50f0c2cf2c032b4b011460071432354fb47113f7734b4bff4070fee278ce8c';
	
	//the actual password hash
	var hash = crypto.createHash('sha256');
	console.log("hasing: "+salt+s+date);
	hash.update(salt+s+date);
	hash = hash.digest('hex');
	console.log("resulting hash: ")
	console.log(hash)
	return hash;
} 
function valid(u) {
	//check if user exists
	//TODO: write actual thing.
	console.log('validating user: '+ u.name);
	if (u) {
		UserInstance.findOne({name: u.name}, ['date', 'password'], function(err, docs) {
			if(err) { console.log("Error in valid: "+err) }
			var date = new Date(docs.doc.date);
			u.password = hash(u.password, date);
			if (u.password === docs.password) {
				console.log("valid: true")
				return true;
			} else {
				return false;
			}
		});
	}
}


// REST methods
function validate(req, res, next) {
	//check if field is valid, only for username
	UserInstance.find(req.body, ['_id'], function(err, docs) {
		var isAvaliable = true
		if (docs.length>0) { isAvaliable = false; }
		req.data = { isAvaliable: isAvaliable };
		next();
	});
}

function signIn(req, res, next) {
	var u = req.body.user
	console.log('validating user: '+ u.name);
	if (u) {
		UserInstance.findOne({name: u.name}, ['date', 'password'], function(err, docs) {
			if(err) { console.log("Error in valid: "+err) }
			var date = new Date(docs.doc.date);
			u.password = hash(u.password, date);
			req.signedIn = (u.password === docs.password);
			next();
		});
	}
}
function signOut(req, res, next) {
	user = "";
	session.destroy();
	next();
}
function create(req, res, next) {
	console.log("Starting create");
	var date = new Date();
	console.log("Created date");
	console.log(req);
	console.log("###############################################")
	console.log(hash(req.body.user.password, date))
	console.log(date)
	var userc = {
		name: req.body.user.name,
		password: hash(req.body.user.password, date),
		mail: req.body.user.mail,
		date: date
	}
	console.log("creating userInstance with data: "+userc);
	var user = new UserInstance({
		name: req.body.user.name,
		password: hash(req.body.user.password, date),
		mail: req.body.user.mail,
		date: date
	});
	console.log("initiated user")
	
	user.save(function (err) { 
		if (err) { 
			console.log("Could not initiate users: "+err);
			req.isCreated = false
			req.err = err; 
		} else {
			req.isCreated = true;
		} 
		console.log("saved")
		next();
	});
}
function destroy(req, res, next) {
	next();
}

function validateSession(req, res, next) {
	console.log(req.body);
	/*session.validate(user.name)*/
	next();
}
exports.session 	= session; //the child model.
exports.validate	= validate;
exports.signIn 		= signIn;
exports.signOut		= signOut;
exports.create 		= create;
exports.destroy 	= destroy;

exports.validateSession = validateSession;