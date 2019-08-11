var express = require('express');
var server = express();
var app = require('http').Server(server);
var io = require('socket.io')(app);

var fs = require('fs');

var os = require('os');
var opts = {
    port: 1947,
    baseDir: __dirname + '/app/'
};

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://wam_talkiness:wam_talkiness@cluster0-gwc4o.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {

  const collection = client.db("app").collection("questions");

  client.close();

});

/***************************************************/
/******************** DATABASE *********************/
/***************************************************/
  
    var brown = '\033[33m',
    green = '\033[32m',
    reset = '\033[0m';

// /***************************************************/
// /********************* ESCUTAR *********************/
// /***************************************************/
app.listen(opts.port);

console.log(brown + "WAM - Talkiness" + reset);
getAddresses(function (address) {
    console.log(green + 'Your server is listening on http://' + address + ':1947/' + reset);
});

// app.configure(function () {
//     app.use(express.bodyParser());
// });

// /***************************************************/
// /******************** SOCKET IO ********************/
// /***************************************************/

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

// /***************************************************/
// /********************** ROUTES *********************/
// /***************************************************/

server.get('/', function (req, res) {
    res.send('Hello World');
});

server.get("/slides", function (req, res) {
    fs.createReadStream(opts.baseDir + 'slides/index.html').pipe(res);
});

server.get("/slides/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'slides/' + req.params[0]).pipe(res);
});

server.get("/emails", function (req, res) {
    fs.createReadStream(opts.baseDir + 'emails/index.html').pipe(res);
});

server.get("/emails/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'emails/' + req.params[0]).pipe(res);
});

server.get("/speaker", function (req, res) {
    fs.createReadStream(opts.baseDir + 'speaker/index.html').pipe(res);
});

server.get("/speaker/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'speaker/' + req.params[0]).pipe(res);
});

server.get("/public", function (req, res) {
    fs.createReadStream(opts.baseDir + 'public/index.html').pipe(res);
});

server.get("/public/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'public/' + req.params[0]).pipe(res);
});

server.get("/css/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'assets/css/' + req.params[0]).pipe(res);
});

server.get("/js/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'assets/js/' + req.params[0]).pipe(res);
});

server.get("/fonts/*", function (req, res) {
    fs.createReadStream(opts.baseDir + 'assets/fonts/' + req.params[0]).pipe(res);
});

server.get("/socket.io/*", function (req, res) {
    fs.createReadStream(opts.baseDir + '../node_modules/socket.io/node_modules/socket.io-client/' + req.params[0]).pipe(res);
});

server.get('/questions/get', function (req, res) {
    Question.find({}, function (err, docs) {
        res.json(docs);
    });
});

server.get('/questions/get/:objectID', function (req, res) {
    var $objectID = req.route.params.objectID;
    Question.find({
        _id: $objectID
    }, function (err, docs) {
        res.json(docs);
    });
});

server.post('/questions/add', function (req, res) {
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

/***************************************************/
/******************** FUNCTIONS ********************/
/***************************************************/

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

function getPatch($Url) {

    if ($Url === undefined) {
        return 'app/slides';
    }

    var $split_url = $Url.split(':' + opts.port + '/');
    return $split_url[1] === '' ? 'slides' : $split_url[1];
}
