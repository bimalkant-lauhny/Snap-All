var http = require('http'),
	screenshot = require('screenshot-desktop'),
	express = require('express')

const publicIp = require('public-ip');

var app = express();	


var server = http.createServer(app);

var io = require('socket.io')(server);

var port = process.env.PORT || 3010;

server.listen(port, (err)=>{
	if(err){
		console.log(err);
		throw err;
	}

	console.log("Server is running on %d", port);
});

app.get('/', (req, res) => {
	res.render('index');
});

io.on("connection", (socket) =>{
	socket.on("getSc",() => {
		screenshot().then((img) => {
			console.log(typeof(img));
			socket.send(img);
			console.log(" Snap taken");
		});
	});

	socket.on("end", () => {
		console.log("Bye bye!")
	});
});
