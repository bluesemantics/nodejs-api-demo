var mongo = require('mongodb');
var mongouri = require('mongo-uri');

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    BSON = mongo.BSONPure;

exports.addPerson = function(req, res) {
    var person = req.body;
    console.log('Adding person: ' + JSON.stringify(person));
    MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, db) {
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
    });
};

exports.findAll = function(req, res) {
  res.send({});
    /*MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, db) {
        db.collection('people', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    });*/
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving person: ' + id);
    MongoClient.connect(process.env.MONGOLAB_URI, {native_parser:true}, function(err, db) {
        db.collection('people', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                res.send(item);
            });
        });
    });
};
