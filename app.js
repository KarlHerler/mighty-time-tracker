
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
function addData(req, res, next) {
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
	} else {
		/*var objIds = req.body.tID;*/
	}
	
	req.body.tID = objIds;
	next();
} 

// Routes
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

app.get('/', loadData, function(req, res){
  res.render('index', {
    title: app.set('title'),
		data: ["req.tags"],
		tracking: true,
		tID: "data.length"
  });
});

app.post('/', addData, loadData, function(req, res) {
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
