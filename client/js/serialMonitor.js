let SerialPort = require('serial-worker');
let io = require('socket.io-client');

var socket;
let user = "debugClient";
let serverURL = "localhost:3000";
const connectSocket = (e) => {
	socket = io(serverURL);

	socket.on('connect', () => {
		console.log('connecting');

		socket.emit('join', { name: user });
	});
};

const init = () => {
	console.log("init called");
	setupPage();
	setupPort();
	setupSocket();
};

const setupSocket = () => {
	// setup buttons

	// connect socket
	connectSocket();
};

const sentDataViaSocket = (data) => {
	let dataPacket = {
		dateCreated: Date.now,
		buffer: data,
		name: user,
	};

	socket.emit('sensorData', dataPacket, function (response) {
		console.log(response);
	});
	console.log(`Data sent over socket to ${serverURL}: ${dataPacket}`);
};

const setupPage = () => {


	SerialPort.list(generatePortList);
  //console.log('hey');
};

const generatePortList = (err, ports) => {
	console.log("generatePortList");
	console.log(ports);
	let portList = document.querySelector("#portList");
	if (ports.length <= 1) {
		let node = document.createElement("p");
		  node.value = "No Serial Ports!";
		portList.appendChild(node);
	} else {
		for (let i = 0; i < ports.length; i++) {
			let node = document.createElement('option');
			node.value = ports[i].comName;
			node.text = ports[i].comName;
			portList.appendChild(node);
		}
	}
};

const setupPort = () => {
	let sPort = new SerialPort.SerialPort('COM4', {
		baudrate: 9600,
		parser: SerialPort.parsers.raw
	});

	sPort.on("open", function () {
	  console.log('open');
	  sPort.on('data', function(data) {
	      var floatData = packetToFloatArr(data);
        $("")
				sentDataViaSocket(floatData)
	      //console.log(a[0]);
	  });
	});
};

const updateTerminal = (babyJesus) => {
    $("#arb").terminal(function(command,term) {
        //console.log(babyJesus);
        term.echo(babyJesus);
    },{prompt: 'λ', name: 'prompt'});
};

/**
 * Creates an array of 15 floats from binary buffer of length 60+
 */
const packetToFloatArr = (byteData)  => {
    buffer = byteData.slice(0, 60);

    var lower = 0;
    var upper = 4;

    var floatArr = new Float32Array(15);

    for (var i = 0; i < 15; i++) {
        var tmpSlice = buffer.slice(lower,upper);
        floatArr[i] = tmpSlice.readFloatLE();

        lower += 4;
        upper += 4;
    }

    return floatArr;
};




window.onload = init;
