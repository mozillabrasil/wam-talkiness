var express = require('express');
var fs = require('fs');
var io = require('socket.io');
var mongoose = require('mongoose');

var app = express.createServer();
var staticDir = express.static;

$con = mongoose.connect('mongodb://localhost/wam_talkiness');
mongoose.connection.once('connected', function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Connected to database");
    }
});
var Schema = mongoose.Schema;
var QuestionSchema = new Schema({
    name: String,
    email: String,
    question: String,
    hashGravatar: String
});


var Question = mongoose.model('questions', QuestionSchema);

io = io.listen(app);

var opts = {
    port: 1947,
    baseDir: __dirname + '/app/'
};
var os = require('os');

function getAddresses(cb) {
    var interfaces = os.networkInterfaces();
    for (k in interfaces) {
        for (k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                cb(address.address);
            }
        }
    }
}

app.configure(function () {
    app.use(express.bodyParser());
});

io.sockets.on('connection', function (socket) {
    socket.on('slidechanged', function (slideData) {
        socket.broadcast.emit('slidedata', slideData);
    });
    socket.on('fragmentchanged', function (fragmentData) {
        socket.broadcast.emit('fragmentdata', fragmentData);
    });
    socket.on('remote_connected', function () {
        console.log('remote connected');
    });
    socket.on('remote', function (data) {
        console.log('remote command', data);
        io.sockets.in('offerer').emit('remote_command', data);
    });
    socket.on('rtc_init_receiver', function (data) {
        console.log('received joined');
        this.join('receiver');
    });

    socket.on('rtc_init_offerer', function (data) {
        console.log('offerer has joined');
        this.join('offerer');
    });

    socket.on('rtc_answer', function (data) {
        console.log(data);
        io.sockets.in('offerer').emit('rtc_answer', data);
    });

    socket.on('rtc_request', function (data) {
        console.log(data);
        io.sockets.in('receiver').emit('rtc_request', data);
    });
});

function getPatch($Url) {

    if ($Url === undefined) {
        return 'app/slides';
    }

    var $split_url = $Url.split(':' + opts.port + '/');
    return $split_url[1] === '' ? 'slides' : $split_url[1];
}

app.get("/slides", function (req, res) {
    fs.createReadStream(opts.baseDir + 'slides/index.html').pipe(res);
});

app.get("/slides/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'slides/' + req.params[0]).pipe(res);
});

app.get("/speaker", function (req, res) {
    fs.createReadStream(opts.baseDir + 'speaker/index.html').pipe(res);
});

app.get("/speaker/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'speaker/' + req.params[0]).pipe(res);
});

app.get("/css/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'assets/css/' + req.params[0]).pipe(res);
});

app.get("/js/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'assets/js/' + req.params[0]).pipe(res);
});

app.get("/fonts/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'assets/fonts/' + req.params[0]).pipe(res);
});

app.get('/questions/get', function (req, res) {
    Question.find({}, function (err, docs) {
        res.json(docs);
    });
});

app.get('/questions/get/:objectID', function (req, res) {
    var $objectID = req.route.params.objectID;
    Question.find({
        _id : $objectID
    }, function (err, docs) {
        res.json(docs);
    });
});

app.post('/questions/add', function (req, res) {
    var $question = new Question(req.body);
    $question.save(function (error, data) {
        if (error) {
            error.success = false;
            res.json(error);
        }
        else {
            data.success = true;
            res.json(data);
        }
    });
});

// Actually listen
app.listen(opts.port || null);

var brown = '\033[33m',
        green = '\033[32m',
        reset = '\033[0m';

var slidesLocation = "http://localhost" + (opts.port ? (':' + opts.port) : '');

console.log(brown + "reveal.js - WebRTC Server and socket.io remote control" + reset);
getAddresses(function (address) {
    console.log(green + 'Your server is listening on http://' + address + ':1947/' + reset);
});
