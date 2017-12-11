var io = io('http://localhost:3000');

function clearSnaps() {
    var snapgallery = document.getElementsByClassName("snapgallery")[0];
    while (snapgallery.firstChild) {
            snapgallery.removeChild(snapgallery.firstChild);
    }
}

function checkData() {
    clearSnaps();
	var ip = document.getElementsByName('ip');
    var netmask = document.getElementsByName('netmask');
	console.log("IP: ", ip[0].value + "." + ip[1].value + "." + ip[2].value + 
        "." + ip[3].value);
	console.log("NetMask: ", netmask[0].value + "." + netmask[1].value + "." + 
        netmask[2].value + "." + netmask[3].value); 
    return true;
}

var getSnap = function () {
    clearSnaps();
    io.emit("getSnap");
};

io.on("message", function (ip) {
    console.log("Server sent image write event of: ", ip);
    var snapgallery = document.getElementsByClassName("snapgallery")[0];

    var snapipdiv = document.createElement("div");
    snapipdiv.className = "snapip col-md-3 col-sm-3 col-xs-6";

    var snapsdiv = document.createElement("div");
    snapsdiv.className = "snaps";

    var img = document.createElement("img");
    img.src = "screenshots/" + ip + ".jpg";
    img.height = "150";
    img.width = "266";

    var ipdiv = document.createElement("div");
    ipdiv.className = "ip";
    ipdiv.innerHTML = ip; 

    snapsdiv.appendChild(img);
    snapsdiv.appendChild(ipdiv);
    
    snapipdiv.appendChild(snapsdiv);

    snapgallery.appendChild(snapipdiv);
});
