require('newrelic');

var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    mongo = require('mongodb'),
    mongouri = require('mongo-uri');

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    BSON = mongo.BSONPure;

var db;

var addPerson = function(req, res) {
    var person = req.body;
    console.log('Adding person: ' + JSON.stringify(person));
    //MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, db) {
        db.collection('people', function(err, collection) {
            collection.insert(person, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(result[0]);
                }
            });
        });
    //});
};

var findAll = function(req, res) {
    //res.send({});
    //MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, db) {
        db.collection('people', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    //});
};

var findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving person: ' + id);
    //MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, db) {
        db.collection('people', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                res.send(item);
            });
        });
    //});
};

var app = express();

//app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/people', findAll);
app.get('/people/:id', findById);
app.post('/people', addPerson);


MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, database) {
    if (err) throw err;
    db = database;

    http.createServer(app).listen('/tmp/nginx.socket', function () {
        //console.log("Express server listening on port " + app.get('port'));
        fs.openSync('/tmp/app-initialized', 'w');
    });
});
