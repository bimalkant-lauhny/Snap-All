
var io = io('http://localhost:3000');
var counter = 1;
function clearSnaps() {
    var snapgallery = document.getElementsByClassName("snapgallery")[0];
    while (snapgallery.firstChild) {
            snapgallery.removeChild(snapgallery.firstChild);
    }
    counter = 1;
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

function disableBtn(){
    document.getElementById('snap-btn').disabled = false;
}

function hidePreview(){
    document.getElementsByClassName('preview')[0].className = "preview";
    document.getElementsByClassName('layer')[0].className = "layer";
}

function showPreview(id){
        console.log("Called");
        document.getElementsByClassName('preview')[0].className += " final";
        document.getElementsByClassName('layer')[0].className = "layer final";
        var html = id.innerHTML;
        console.log("Img is ",html);
        document.getElementsByClassName('preview-img')[0].innerHTML = html;
}
io.on("message", function (ip) {
    console.log("Server sent image write event of: ", ip);
    var snapgallery = document.getElementsByClassName("snapgallery")[0];

    var snapipdiv = document.createElement("div");
    snapipdiv.className = "snapip col-md-3 col-sm-3 col-xs-6";

    var snapsdiv = document.createElement("div");
    snapsdiv.className = "snaps";

    var att = document.createAttribute("onclick");
    att.value = "showPreview(this)";
    snapsdiv.setAttributeNode(att);

    var img = document.createElement("img");
    img.src = "screenshots/" + ip + ".jpg";
    img.height = "180";
    // img.width = "266";

    var ipdiv = document.createElement("div");
    ipdiv.className = "ip";
    ipdiv.innerHTML = ip; 

    var pcdiv = document.createElement("div");
    pcdiv.className = "ip";
    pcdiv.innerHTML = "PC Number : "+counter;
    ++counter; 

    snapsdiv.appendChild(img);
    snapsdiv.appendChild(pcdiv);
    snapsdiv.appendChild(ipdiv);
    
    snapipdiv.appendChild(snapsdiv);

    snapgallery.appendChild(snapipdiv);
});
