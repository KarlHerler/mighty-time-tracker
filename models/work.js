var  mongoose = require('mongoose');
//data connection

mongoose.connect('mongodb://localhost:27017/worktime_test');
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

function isEqual(d1, d2) {
	if (d1==undefined && d2==undefined) { return true; 	} 
	if ((d1!=undefined && d2==undefined) || (d1==undefined && d2!=undefined)) { return false; } /*actually an exception*/
	return ((Math.abs(d1.getTime()-d2.getTime()))<100);
}

function loadData(req, res, next) {
	
	/* Loads all data. */
	/*var filter = {}
	if(req.params.tag) {
		console.log("fetching data for tag: "+req.params.tag)
		filter = {"tag": req.params.tag}
	}*/
	
	WorkInstance.find({}, ['_id','tag', 'start', 'stop'], {sort:[['start', -1]]}, function(err, docs) {
		var workDatas = [];
		if (docs.length>0) {

			var cWorkData = {workData: {	_id: docs[0].doc._id, 
																	tag: 			[docs[0].doc.tag], 
																	start: 		new Date(docs[0].doc.start),
																	stop: 		new Date(docs[0].doc.stop),
																	isFinished: true
																}};
			
			for (i=1;i<docs.length;i++) {
				if (docs[i].doc.start!=undefined && docs[i].doc.stop==undefined) {
					cWorkData.workData.isFinished = false;
				}
				if (isEqual(cWorkData.workData.start, docs[i].doc.start) && isEqual(cWorkData.workData.stop, docs[i].doc.stop) 
						|| (!cWorkData.workData.isFinished && isEqual(cWorkData.workData.start, docs[i].doc.start))) {
							
					cWorkData.workData.tag.push(docs[i].doc.tag);
					
				} else {
					
					workDatas.push(cWorkData);
					var z = workDatas.length-1;

					var time = (workDatas[z].workData.stop - workDatas[z].workData.start);

					workDatas[z].workData.timeStr = timeStr(time);
					workDatas[z].workData.time = time;

					cWorkData = {workData: {	_id: docs[i].doc._id, 
																			tag: 			[docs[i].doc.tag], 
																			start: 		new Date(docs[i].doc.start),
																			stop: 		new Date(docs[i].doc.stop),
																			isFinished: true
																	}};

				}
			}
		}
		//needs to add remaining stuff in cWorkdata after loop
		workDatas.push(cWorkData);
		var z  = workDatas.length-1;
		var time = (workDatas[z].workData.stop - workDatas[z].workData.start);

		workDatas[z].workData.timeStr = timeStr(time);
		workDatas[z].workData.time = time;
		
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