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
		console.log("hola");
		screenshot().then((img) => {
			fs.writeFile("snap2.png", img , "binary" , (err) =>{
				if(err)
					console.log(err);
			});
			console.log(" Snap taken");
		});
	});

	socket.on("end", () => {
		console.log("Bye bye!")
	});
});