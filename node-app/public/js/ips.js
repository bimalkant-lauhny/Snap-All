var io = io('http://localhost:3000');

	var getSnap = () =>{
		io.emit("getSnap");
	}
	var quit = () => {
		io.emit("end");
	}


function checkData(){
	var ip = document.getElementByName('ip');
	console.log(ip.value);
}