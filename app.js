
/**
 * Module dependencies.
 */

var express = require('express');
var work = require('./models/work.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('title', 'Mighty time tracker');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//THROW INTO MODEL!
//later.
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
	//work.WorkInstance.find().sort(['stop', 'descending']).all(function(docs) {
	work.WorkInstance.find({}, ['_id','tag', 'start', 'stop'], {sort:[['stop', -1]]}, function(err, docs) {
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
function addData(req, res, next) {
	
	/* This code is rather messy to be honest */
	
	if (req.body.active=='true') {
		var tags = req.body.tags;
		var objIds = [];
		
		for(i=0;i<tags.length;i++) {
			var thisWork = new work.WorkInstance({ tag: tags[i] });
			objIds[i] = thisWork._id;
			thisWork.save(function (err) {
			  if (!err) console.log('Success!');
				if (err) { req.err = err; }
			});
		}
		req.body.tID = objIds;
		
	} else {
		var objIds = req.body.tID;
		var workDatas = []
		
		for (i=0;i<objIds.length;i++) {
			work.WorkInstance.findById((objIds[i]), function(err, time) {
				if(!err) {
					var date = new Date;
					time.done = true;
					time.stop = date;
					workDatas[i] = {workData: {	_id: time._id,
																			tag: time.tag,
																			start: 	new Date(time.start),
																			stop: 	new Date(time.stop)
																		}};
					
					time.save(function (err) {
						if (!err) console.log('Success!');
						if (err) { req.err = err; }
					});
				} else {
					console.log(err);
				}
			}); //end findById
		} // end for
		req.newWorkDatas = workDatas;
	} // end if (req.active)
	next();
}


//Routes!
app.get('/', loadData, function(req, res){
//		res.send("ffuu")
  res.render('index', {
    title: app.set('title'),
		data: req.workDatas,
		tracking: true
  });
});

app.post('/', addData, loadData, function(req, res) {
	res.render('index', {
		title:  app.set('title'),
		data: req.workDatas,
		tracking: true
	})
})
app.post('/work', addData, function(req, res) {
	if (!req.err) { res.send([req.body, req.newWorkDatas]); } else { res.send("Y U NO WORK?"); }
});
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(8000);
  console.log("Express server listening on port %d", app.address().port);
}
