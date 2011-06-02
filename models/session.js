//extends user.js
//var user = require('user.js')
var session = {}

function create(u) {
	console.log('creating session for '+ u)
	return true;
}
function destroy(req, res, next) {}
function validate(name) {
	console.log("validating "+name+"!")
}

exports.create  = create;
exports.destroy = destroy;
exports.validate = validate;