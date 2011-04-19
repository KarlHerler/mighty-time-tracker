
/**
 * Module dependencies.
 */

var express = require('express'), mongoose = require('mongoose');

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


//data connection

mongoose.connect('mongodb://localhost:27017/worktime');
var Schema = mongoose.Schema;
var	ObjectId = Schema.ObjectId;

var work = new Schema({id: ObjectId, tag: String});

// a setter
/*Comment.path('name').set(function (v) {
  return v.capitalize();
});

// middleware
Comment.pre('save', function (next) {
    notify(this.get('email'));
    next();
});*/

var data = []

function addData(work, next) {
	var tags = work.tags.split(",");
	data[parseInt(work.tID)] = tags;
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: app.set('title'),
		data: data,
		tID: data.length
  });
});

app.post('/', function(req, res) {
	addData(req.body.work)
	console.log(data);
	res.render('index', {
		title:  app.set('title'),
		data: data,
		tID: data.length
	})
})
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(8000);
  console.log("Express server listening on port %d", app.address().port);
}
