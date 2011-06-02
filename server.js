
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

console.log("OH MY IT'S THE LATEST VERSION");

//Routes!
app.get('/', work.loadData, function(req, res){
		var uname = (req.session.user===undefined) ? "" : req.session.user.name;
		res.render('index', {
    	title: app.set('title'),
			data: req.workDatas,
			username: uname,
			tracking: true
  });
});
app.post('/', work.addData, work.loadData, function(req, res) {
	res.render('index', {
		title:  app.set('title'),
		data: req.workDatas,
		tracking: true
	})
})
app.post('/work', work.addData, function(req, res) {
	if (!req.err) { res.send([req.body, req.newWorkDatas]); } else { res.send("Y U NO WORK?"); }
});
app.get('/session', user.validateSession, function(req, res) {
	res.render('session', {
		title: app.set('title')
	})
});
app.post('/session', user.signIn, function(req, res) {
	if (req.signedIn) { 
		res.redirect('/')
	} else { res.send("FUCK YOU, TRYING TO HACK MY SHIT ARE WE?!")}
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
