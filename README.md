#Mighty time tracker

**NOTE: This is just a dump of a personal project that used to be a private repo and thus is pretty poorly documented and hacky.**

Mighty time tracker is a time tracking tool that I wrote in order to keep track of work I've done and gotten paid for on a hourly basis. Most of the code is written in 2010 in javascript using node.js. 

##Dependencies
- Node.js, some ancient version I'm sure.
- Mongodb
- Express
- Jade
- Stylus
- bson
- mongoose

##Gettings started
Run the server by running the `server.js` file using `node server.js` and it should work if you have mongodb installed. Mighty pressumes that it can access mongodb on `mongodb://localhost:27017/`


##Architecture
- `server.js` this is probably where you want to start to understand the app. It's quite a mess but give it a go.
- `/models` contains the data models used in mighty (`session`, `user`, `work`), some are persisted to mongo, others aren't.
- `/public` contains the clientside javascript and stylesheets. The stylesheets are written in stylus (<-- madness). 
- `/views` contains all the views, these are written in jade (<-- madness).


##Personal todos

Remember to add:
`db.users.ensureIndex({"mail": 1}, {unique: true});`
`db.users.ensureIndex({"name": 1}, {unique: true});`
to mongo.
