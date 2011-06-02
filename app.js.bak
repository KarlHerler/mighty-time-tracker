
/**
 * Module dependencies.
 */
require.paths.unshift('./node_modules');
var express = require('express');
var work = require('./models/work.js');	//the data model.

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


//Routes!
app.get('/', work.loadData, function(req, res){
		res.render('index', {
    title: app.set('title'),
		data: req.workDatas,
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
// Only listen on $ node app.js

if (!module.parent) {
	app.listen(80);
  console.log("Express server listening on port %d", app.address().port);
}
