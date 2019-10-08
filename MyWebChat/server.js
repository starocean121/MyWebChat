//'use strict';
// Don't use http server. uses express server instead
//var http = require('http');
//var port = process.env.PORT || 1337;



//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);

var express = require('express');
var app = express();

var mongoose = require('mongoose');
var dbUrl = 'mongodb://starocean121:Passw0rdmongodb@clustertest-shard-00-00-bidlb.mongodb.net:27017,clustertest-shard-00-01-bidlb.mongodb.net:27017,clustertest-shard-00-02-bidlb.mongodb.net:27017/admin?ssl=true&replicaSet=ClusterTest-shard-0&authSource=admin&retryWrites=true&w=majority';

var bodyParser = require('body-parser');

//var http = require('http').Server(app);
//var io = require('socket.io')(http);

//io.on('connection', () => {
//    console.log('a user is connected')
//})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    "/",
    express.static(__dirname)
);

//mongoose.connect(dbUrl, (err) => {
//    console.log('mongodb connected', err)
//});
mongoose.connect(dbUrl, function (err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
});

var Message = mongoose.model('Message', { name: String, message: String });


// Routing points
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

var server = app.listen(1337, () => {
    console.log('server is running on port', server.address().port);
});