var io = io('http://localhost:3000');

var getSnap = () =>{
    io.emit("getSnap");
}

var quit = () => {
    io.emit("end");
}

io.on("message", (ip) => {
    console.log("Server sent image write event of: ", ip);
    var gallery = document.getElementsByClassName("gallery")[0];
    var img = document.createElement("img");
    img.src = "screenshots/" + ip + ".jpg";
    img.height = "200";
    img.width = "400";
    gallery.appendChild(img);
});

function checkData(){
	var ip = document.getElementsByName('ip')[0];
	console.log(ip.value);
    return true;
}
