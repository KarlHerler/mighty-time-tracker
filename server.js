
/**
 * Module dependencies.
 */
require.paths.unshift('./node_modules');
var express = require('express');
var work = require('./models/work.js');	//the data model.
var user = require('./models/user.js')	//the user model.

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('title', 'Mighty time tracker');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'My gosh its a secret token.' }));
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


//Routes!
app.get('/', work.loadData, function(req, res){
		var uname = (req.session.user===undefined) ? "" : req.session.user.name;
		res.render('index', {
    	title: app.set('title'),
			page: "index",
			data: req.workDatas,
			username: uname,
			tracking: true
  });
});
app.post('/', work.addData, work.loadData, function(req, res) {
	res.render('index', {
		title:  app.set('title'),
		page: "index",
		data: req.workDatas,
		tracking: true
	})
});
app.post('/work', work.addData, function(req, res) {
	if (!req.err) { res.send([req.body, req.newWorkDatas]); } else { res.send("Y U NO WORK?"); }
});
app.get('/work/unfinished', work.loadUnfinished, function(req, res) {
	if (!req.err) { res.send(req.workDatas); } else { res.send("Y U NO WORK?!") }
})
app.get('/user/session', function(req, res) {
	res.render('session', {
		title: app.set('title'),
		page: "user/session"
	})
});
app.get('/user/create', function(req, res) {
	res.render('user/create', {
		title: app.set('title'),
		page: "user/create"
	})
});
app.post('/user/create', user.create, function(req, res) {
	res.send({isCreated: req.isCreated, err: req.err});
});
app.post('/user/validate/:parameter', user.validate, function(req, res) {
	res.send(req.data)
});

app.post('/session', user.signIn, function(req, res) {
	if (req.signedIn) { 
		res.redirect('/')
	} else { res.send("FUCK YOU, TRYING TO HACK MY SHIT ARE WE?!")}
});

app.get('/favicon.ico', function(req, res){ res.send("") });
app.get('/:tag', work.loadData, function(req, res) {
	var uname = (req.session) ? (req.session.user===undefined) ? "" : req.session.user.name : "";
	res.render('index', {
		title: req.params.tag,
		page: "index",
		data: req.workDatas,
		username: uname,
		tracking: true
	})
});

// Only listen on $ node app.js

if (!module.parent) {
	if(process.env.NODE_ENV==="development") {
		app.listen(8000);	
	} else {
		app.listen(80);	
	}
  console.log("Express server listening on port %d", app.address().port);
}
