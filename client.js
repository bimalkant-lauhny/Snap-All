var http = require('http'),
	screenshot = require('screenshot-desktop'),
	express = require('express')

var app = express();	

var server = http.createServer(app);

var io = require('socket.io')(server);

var port = process.env.PORT || 3010;

server.listen(port, function (err) {
	if(err){
		console.log(err);
		throw err;
	}
	console.log("Server is running on %d", port);
});

app.get('/', function (req, res) {
	res.render('index');
});

io.on("connection", function (socket) {
	socket.on("getSc",function () {
		screenshot().then(function (img) {
			socket.send(img);
			console.log("Snap Taken.");
		});
	});

	socket.on("disconnect", function () {
		console.log("Connection Closed by server!")
	});
});
