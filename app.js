
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

/*function commitData(req, res, next) {
	workHash = req.body.work;
	var tags = workHash.tags.split(",");

	for(i=0;i<tags.length;i++) {
		tags[i] = tags[i].replace(/^\s+|\s+$/g, '');
		var thisWork = new work.WorkInstance({ tag: tags[i] });
		thisWork.save(function (err) {
		  if (!err) console.log('Success!');
		});
	}
	next();
}*/

//THROW INTO MODEL!
//later.

function addData(req, res, next) {
	console.log(req.body);
	
	if (req.body.active=='true') {
		console.log("calls NOT DONE");
		
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
		console.log("calls DONE!")
		var objIds = req.body.tID;
		
		for (i=0;i<objIds.length;i++) {
			work.WorkInstance.findById((objIds[i]), function(err, time) {
				if(!err) {
					var date = new Date;
					time.done = true;
					time.stop = date;
					time.save(function (err) {
						console.log("tried to save");
						console.log(err);
						if (!err) console.log('Success!');
						if (err) { req.err = err; }
					})
				} else {
					console.log(err);
				}
			})
		}
		
	}
	next();
}


//Routes!
app.get('/', /*loadData,*/ function(req, res){
  res.render('index', {
    title: app.set('title'),
		data: ["req.tags"],
		tracking: true,
		tID: "data.length"
  });
});

app.post('/', addData, /*loadData,*/	 function(req, res) {
	res.render('index', {
		title:  app.set('title'),
		data: ["req.tags"],
		tracking: true,
		tID: "data.length"
	})
})
app.post('/work', addData, function(req, res) {
	if (!req.err) { res.send(req.body); } else { res.send("Y U NO WORK?"); }
});
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(8000);
  console.log("Express server listening on port %d", app.address().port);
}
