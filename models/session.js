//extends user.js
//var user = require('user.js')
var session = {}

/*app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
*/

function create(u) {
	console.log('creating session for '+ u)
	return true;
}
function destroy(req, res, next) {}
function validate(name) {
	return true;
}

exports.create  = create;
exports.destroy = destroy;
exports.validate = validate;