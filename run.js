require('newrelic');

var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    person = require('./routes/person');

var app = express();

function getFiles(dir,files_){
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name,files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
console.log(getFiles('/tmp'))

//app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/people', person.findAll);
app.get('/people/:id', person.findById);
app.post('/people', person.addPerson);


//http.createServer(app).listen('/tmp/nginx.socket', function () {
    //console.log("Express server listening on port " + app.get('port'));
//});
