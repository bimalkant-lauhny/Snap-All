
var http = require('http'),
	express = require('express'),
	screenshot = require('screenshot-desktop'),
	fs   = require('fs'),
	bodyParser = require('body-parser'),
    config = require("./config");
 
var app = express();

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
}));	

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(function auth(req, res, next) { // To authorize the user
	function raiseErr() {
		var err = new Error("You are not authenticated!");
		err.status = 401;
		next(err);
	}

	var authHeader = req.headers.authorization;
	if (!authHeader) {
		raiseErr();
		return;
	}
	var auth = new Buffer(authHeader.split(" ")[1], "base64").toString().split(":");
	var user = auth[0];
	var pass = auth[1];
	if (user === config.username && pass === config.password) {
		next(); // authorized
	} else {
		raiseErr();
	}
});

app.use	(express.static(__dirname+"/public"));
app.use(function(err, req, res, next) {
	res.writeHead(err.status || 500, {
		"WWW-Authenticate": "Basic",
		"Content-Type": "text/plain"
	});
	res.end(err.message);
});

var server = http.createServer(app);

var ioServer = require('socket.io')(server);

var serverPort = config.serverPort;

server.listen(serverPort, function (err) {
	if(err){
		console.log(err);
		throw err;
	}
	console.log("Server is running on %d", serverPort);
});

app.get('/', function (req, res) {
	res.render('index');
});

var ips = [];

app.post('/getIp', function (req, res) {
    // get ip and netmask arrays of octets from frontend
	var ip = req.body.ip,
		netmask = req.body.netmask;

    // convert ip and netmask array values from string to number
    ip = ip.map(function(octet) {
        return Number(octet);
    });

    netmask = netmask.map(function(octet) {
        return Number(octet);
    });

    // get from user ip to first ip addr of network
    ip.forEach(function(v, i) {
        ip[i] &= netmask[i];
    });

    // get from netmask octets to remaining addresses in an octet 
    ip.forEach(function(v, i) {
        netmask[i] = 255 - netmask[i];
    });

    console.log("Processed ip and netmask: ", ip, netmask);
    
    // generating possible ip addresses and pushing them to ips array in dotted
    // decimal format
    
    ips = [];
    for (var i=0; i<=netmask[0]; ++i) {
        for (var j=0; j<=netmask[1]; ++j) {
            for (var k=0; k<=netmask[2]; ++k) {
                for (var l=0; l<=netmask[3]; ++l) {
                    ips.push((ip[0] + i) + "." + (ip[1] + j) + "." + (ip[2] + k)
                        + "." + (ip[3] + l)); 
                }
            }
        }
    }
    console.log("Last Generated IP: ", ips[ips.length - 1]);
});

var clientPort = config.clientPort;
ioServer.on("connection", function (socket) {
	socket.on("getSnap", function () {
		ips.forEach(function (ip) {
			var ioClient = require('socket.io-client');

			var socket = ioClient('http://' + ip + ':' + clientPort);	
			socket.on('connect', function () {
				console.log("Client connected "+ip);
			});
			socket.on('message', function (data) {
				var p = new Promise((resolve, reject) => {
                    fs.writeFile('public/screenshots/'+ip+'.jpg', data , "binary" , function (err) {
                        if(err)
                            reject(err);
                        else
                            resolve(ip);
                    });
                }).then(function (ip) {
                    console.log("Success Writing Snap of: ", ip);
                    // server is sending 'ip' to itself, to be caught frontend
                    ioServer.send(ip);
                }).catch(function (err) {
                    console.log("Error Writing Snap!");
                });

			});

			socket.emit("getSc");			

            socket.on("disconnect", function() {
                console.log("Connection closed by IP: ", ip);
            });
		});
	});

	socket.on("disconnect", function () {
		console.log("Closed socket connection");
	});
});
