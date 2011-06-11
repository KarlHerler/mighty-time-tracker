var  mongoose = require('mongoose');
//data connection

mongoose.connect('mongodb://localhost:27017/worktime_test');
var Schema = mongoose.Schema;
var	ObjectId = Schema.ObjectId;
var now = Date.now();

var Work = new Schema({
	tID 	: ObjectId,
	tags 	: [],
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

function isEqual(d1, d2) {
	if (d1==undefined && d2==undefined) { return true; 	} 
	if ((d1!=undefined && d2==undefined) || (d1==undefined && d2!=undefined)) { return false; } /*actually an exception*/
	return ((Math.abs(d1.getTime()-d2.getTime()))<100);
}

function loadData(req, res, next) {
	
	/* Loads all data. */
	var filter = {}
	if(req.params.tag) {
		console.log("fetching data for tag: "+req.params.tag)
		filter = {"tags": req.params.tag}
	}
	
	if(req.params.done) { filter = {done: false}; }
	
	WorkInstance.find(filter, ['_id','tags', 'start', 'stop', 'done'], {sort:[['start', -1]]}, function(err, docs) {
		var workDatas = [];
		if (docs.length>0) {
			for (i=0;i<docs.length;i++) {
					workDatas[i] = {workData: {
														tID: 				docs[i].doc._id,
														tags:				docs[i].doc.tags, 
														start: 			new Date(docs[i].doc.start),
														stop: 			new Date(docs[i].doc.stop),
														done: 			docs[i].doc.done 
													}};
					
					var time = (workDatas[i].workData.stop - workDatas[i].workData.start);

					workDatas[i].workData.timeStr = timeStr(time);
					workDatas[i].workData.time = time;
			}
		}
		req.workDatas = workDatas;
		next();
	});
}
exports.loadData = loadData;

function loadUnfinished(req, res, next) {
	req.params.done = true;
	loadData(req, res, next);
}
exports.loadUnfinished = loadUnfinished;

function addData(req, res, next) {
	
	/* This code is rather messy to be honest */
	
	if (req.body.active=='true') {
		
		var thisWork = new WorkInstance({ tags: req.body.tags });
		var objId = thisWork._id;
		thisWork.save(function (err) {
			if (err) { console.log("Could not initiate work: "+err); req.err = err; }
		});
		
		req.body.tID = objId;
		next();
		
	} else {
		
		var objId = req.body.tID;
		var workDatas = []
		
		WorkInstance.find({_id: objId}, function(err, time) {
			if (!err) {
				var date = new Date;
				time[0].done = true;
				time[0].stop = date;
				workDatas = {workData: {	
												_id: 		time[0]._id,
												tags: 	time[0].tags,
												start: 	new Date(time[0].start),
												stop: 	new Date(time[0].stop)
											}};
					var t = (workDatas.workData.stop - workDatas.workData.start);
					workDatas.workData.timeStr = timeStr(t);
					workDatas.workData.time = t;
					
					time[0].save(function (err) {
						if (err) { console.log("Could not complete work: "+err); req.err = err; }
					});
				
				req.newWorkDatas = workDatas;
				next();
			} else {
				console.log("Could not complete work: "+err)
			} // end if (!err)
		}); //end find
	} // end if (req.active)
}

exports.addData = addData;