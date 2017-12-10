
var http = require('http'),
	express = require('express'),
	screenshot = require('screenshot-desktop'),
	fs   = require('fs'),
	bodyParser = require('body-parser');


 
var app = express();

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
}));	

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(function auth(req, res, next) {
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
	if (user === "admin" && pass === "passwd") {
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


var serverPort = process.env.PORT || 3000;



server.listen(serverPort, (err) => {
	if(err){
		console.log(err);
		throw err;
	}
	console.log("Server is running on %d", serverPort);
});


app.get('/', (req, res) => {
	
	res.render('index');

});

var ips = [];

app.post('/getIp', (req, res)=>{
	var ip = req.body.ip,
		netMask = req.body.netmask;

		var nm = netMask.split(".");
		var ipParts = ip.split(".");

		var networkID = ipParts[0] + "." +
						ipParts[1] + "." +
						ipParts[2] + ".";
		for (let i=1; i<255; ++i) {
			ips.push(networkID + i);
		} 
		console.log(ips);

});

var clientPort = 3010;
ioServer.on("connection", (socket) => {
	socket.on("getSnap",() => {
		console.log("hello");
		ips.forEach((ip) => {
			console.log(ip);
			var ioClient = require('socket.io-client');

			var socket = ioClient('http://' + ip + ':' + clientPort);	
			socket.on('connect', () => {
				console.log("Client connected "+ip);
			});
			socket.on('message', (data) => {
				// console.log("hye");
				// data = JSON.parse(data);
				var p = new Promise((resolve, reject) => {
                    fs.writeFile('public/screenshots/'+ip+'.jpg', data , "binary" , (err) => {
                        if(err)
                            reject(err);
                        else
                            resolve(ip);
                    });
                }).then((ip) => {
                    console.log("Success Writing Snap of: ", ip);
                    // server is sending 'ip' to itself, to be caught frontend
                    ioServer.send(ip);
                }).catch((err) => {
                    console.log("Error Writing Snap!");
                });

			});

			socket.emit("getSc");			

		});
	});

	

	socket.on("end", () => {
		console.log("Bye bye!")
	});
});
