var io = io('http://localhost:3000');

	var getSnap = () =>{
		io.emit("getSnap");
	}
	var quit = () => {
		io.emit("end");
	}