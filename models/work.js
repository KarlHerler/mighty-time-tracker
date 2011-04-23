var  mongoose = require('mongoose');
//data connection

mongoose.connect('mongodb://localhost:27017/worktime');
var Schema = mongoose.Schema;
var	ObjectId = Schema.ObjectId;
var now = Date.now();

var Work = new Schema({
	tID 	: ObjectId,
	tag 	: String,
	done	: {type: Boolean, default: false},
	date  : {type: Date, 		default: Date.now }
});

mongoose.model('Work', Work)
// retrieve my model
exports.WorkInstance = mongoose.model('Work');
