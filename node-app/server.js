var http = require('http'),
	express = require('express'),
	screenshot = require('screenshot-desktop'),
	fs   = require('fs')

var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use	(express.static(__dirname+"/public"));

var server = http.createServer(app);

var io = require('socket.io')(server);


var port = process.env.PORT || 3000;


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

let port2 = 3010;
var ips = ["172.16.19.130","192.168.43.103"];
io.on("connection", (socket) =>{
	socket.on("getSnap",() => {
		console.log("hello");
		ips.forEach((ip) =>{
			console.log(ip);
			let io2 = require('socket.io-client');

			let socket = io2('http://' + ip + ':' + port2);	
			socket.on('connect', ()=>{
				console.log("Client connected "+ip);
				// console.log(JSON.parse(data));

			});
			socket.on('message', (data)=>{
				console.log("hye");
				// data = JSON.parse(data);
				fs.writeFile('public/screenshots/'+ip+'.jpg', data , "binary" , (err) =>{
					if(err)
						console.log(err);
				});

			});
			socket.emit("getSc");			

		});
	});

	

	socket.on("end", () => {
		console.log("Bye bye!")
	});
});