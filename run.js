require('newrelic');

var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    person = require('./routes/person');

var app = express();

//app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/people', person.findAll);
app.get('/people/:id', person.findById);
app.post('/people', person.addPerson);


http.createServer(app).listen(5000, function () {
    //console.log("Express server listening on port " + app.get('port'));
});
