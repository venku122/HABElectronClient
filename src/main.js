const path = require('path');
const url = require('url');
let SerialPort = require('serialport');
let io = require('socket.io-client');

var pauseFlag = false;

var socket;
let user = "consoleTelemetryClient";
let serverURL = "http://localhost:3000/";
//let serverURL = "http://hab-web-client-hab-telemetry-server.app.csh.rit.edu/";

const init = () => {
	setupPort();
	setupSocket();
};

const connectSocket = (e) => {
	console.log('connect Socket');

	socket = io(serverURL);
	socket.off();
	if(socket.disconnected || !socket) {

		console.log(socket);
		socket.on('connect', () => {
			console.log('connecting');

			socket.emit('join', { name: user, type: 'dataSource' });
		});

		socket.on('broadcastData', (data) => {
			console.log(`received data echoed back ${ data }`);
		});
	}
};

const init = () => {
	setupPage();
	setupPort();
	setupSocket();
};

const setupSocket = () => {
	console.log('setup Socket');
	// setup buttons
	SerialPort.SerialPort.list(generatePortList);
	// connect socket
	//connectSocket();

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

const generatePortList = (err, ports) => {
	console.log("generatePortList");
	console.log(ports);
	let portList = document.querySelector("#portList");
	if (ports.length >= 0) {
		for (let i = 0; i < ports.length; i++) {
      // iterate ports
		}
	}
};

const setupPort = () => {
	//let portName = $("portList").val();
	let portName = 'Com3';
	let sPort = new SerialPort.SerialPort(portName, {
		baudrate: 9600,
		parser: SerialPort.parsers.raw
	});

	sPort.on("open", function () {
	  console.log('open');
	  sPort.on('data', function(data) {
	      var floatData = packetToFloatArr(data);
        if(!pauseFlag) {
            printFloatArr(floatData);
        }
				sentDataViaSocket(floatData);
	  });
	});
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

widow.onload = init;
