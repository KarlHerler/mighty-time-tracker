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

var WorkInstance = mongoose.model('Work');

function timeStr(time) {
	var timeStr = "";
	if (time>3599999) {
		//has hours
		timeStr = Math.floor(time/3600000) + " h ";
	}
	if (time>59999) {
		//has minutes
		timeStr = timeStr + (Math.floor(time/60000)%60) + " min ";
	}
	//has seconds
	timeStr = timeStr + (Math.floor(time/1000)%60) + " sec."
	return timeStr;
}

function loadData(req, res, next) {
	
	/* Loads all data. */
	
	WorkInstance.find({}, ['_id','tag', 'start', 'stop'], {sort:[['stop', -1]]}, function(err, docs) {
		if (!err) console.log('Success!');
		var workDatas = []
		var workData = {};
		for (i=0;i<docs.length;i++) {
			workDatas[i] = {workData: {	_id: docs[i].doc._id, 
																	tag: docs[i].doc.tag, 
																	start: 	new Date(docs[i].doc.start),
																	stop: 	new Date(docs[i].doc.stop)
																}};
			var time = (workDatas[i].workData.stop - workDatas[i].workData.start);
			workDatas[i].workData.timeStr = timeStr(time);
			workDatas[i].workData.time = time;
		}
		req.workDatas = workDatas;
		next();
	});
}
exports.loadData = loadData;

function addData(req, res, next) {
	
	/* This code is rather messy to be honest */
	
	if (req.body.active=='true') {
		var tags = req.body.tags;
		var objIds = [];
		
		for(i=0;i<tags.length;i++) {
			var thisWork = new WorkInstance({ tag: tags[i] });
			objIds[i] = thisWork._id;
			thisWork.save(function (err) {
			  if (!err) console.log('Success!');
				if (err) { req.err = err; }
			});
		}
		req.body.tID = objIds;
		
		next();
	} else {
		var objIds = req.body.tID;
		var workDatas = []
		
		WorkInstance.find({_id: {$in: objIds}}, function(err, time) {
			if (!err) {
				for (i=0;i<time.length;i++) {
					var date = new Date;
					time[i].done = true;
					time[i].stop = date;
					workDatas[i] = {workData: {	_id: time[i]._id,
																			tag: time[i].tag,
																			start: 	new Date(time[i].start),
																			stop: 	new Date(time[i].stop)
																		}};
					var t = (workDatas[i].workData.stop - workDatas[i].workData.start);
					workDatas[i].workData.timeStr = timeStr(t);
					workDatas[i].workData.time = t;
					
					time[i].save(function (err) {
						if (!err) console.log('Success!');
						if (err) { req.err = err; }
					});
				} // end for
				req.newWorkDatas = workDatas;
				next();
			} // end if (!err)
		}); //end find
	} // end if (req.active)
}

exports.addData = addData;