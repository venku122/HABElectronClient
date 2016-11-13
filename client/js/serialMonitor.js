let SerialPort = require('serial-worker');
let io = require('socket.io-client');

var pauseFlag = false;

var socket;
let user = "debugClient";
let serverURL = "http://localhost:3000/";
//let serverURL = "http://hab-web-client-hab-telemetry-server.app.csh.rit.edu/";
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
		/*
		let node = document.createElement("p");
		  node.value = "No Serial Ports!";
			node.id = "placeholder"
			portList.appendChild(node);
	}*/
		for (let i = 0; i < ports.length; i++) {
			let node = document.createElement("option");
			console.log(ports[i].comName);
			node.value = ports[i].comName;
			node.text = ports[i].comName;
			console.log(node);
			portList.add(node);
		}
	}
};

const setupPage = () => {
    $("#urlselect").on('change', function() {
        serverURL = this.value;
        console.log(serverURL);
				//setupSocket();
    });

		$("#connect").on('click', () => {
			//setupSocket();
			connectSocket();
		});

		/*
		$("#portList").on('onmouseover', () => {
			//	setupSocket();
			generatePortList();
		});*/

  $("#arb").terminal(function(c,t) {
      term = t;
  }, {
      greetings: '',
      onInit: function(t) {
          term = t;
      },
      outputLimit: 10,
      prompt: '',
      enabled: false,
      scrollOnEcho: true,
      height:250,
      //width: '100%'

  });

  $("#pause").click(function() {
    pauseFlag = !pauseFlag;
  });

	SerialPort.list(generatePortList);

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

const printFloatArr = (arr) => {
    term.echo("|Δt: " + arr[0].toFixed(2) + "s|temp: " + arr[1].toFixed(2) + "°C|pres: "
              + arr[2].toFixed(2) + "Pa|alt: " + arr[3].toFixed(2)
              + "m|hum: " + arr[4].toFixed() + "%|gx: ");
    term.echo("" + arr[5].toFixed(2) + "°|gy: " + arr[6].toFixed(2)
              + "°|gz: " + arr[7].toFixed(2) + "°|ax: " + arr[8].toFixed(2)
              + "°|ay: " + arr[9].toFixed(2) + "°|az: " + arr[10].toFixed(2)
              + "°|mx: " + arr[11].toFixed(2) +  "°|my: " + arr[12].toFixed(2)
              + "°|mz: " + arr[13].toFixed(2) + "°|temp: "
              + arr[14].toFixed(2) + "°|");
};

window.onload = init;
