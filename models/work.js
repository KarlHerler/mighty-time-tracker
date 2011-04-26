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
	start : {type: Date, 		default: Date.now },
	stop	: Date
});

mongoose.model('Work', Work)
// retrieve my model
exports.WorkInstance = mongoose.model('Work');


function loadData(req, res, next) {
	work.WorkInstance.find({}, function(err, docs) {
		if (!err) console.log('Success!');
		var tags = []
		for (i=0;i<docs.length;i++) {
			tags[i] = docs[i].doc.tag;	
		}
		req.tags = tags;
		next();
	});
}

//exports.loadData(req, res, next);