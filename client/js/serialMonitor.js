let SerialPort = require('serial-worker').SerialPort;

const init = () => {
	console.log("init called");
	setupPage();
	setupPort();
};

const setupPage = () => {


	SerialPort.list(generatePortList);
};

const generatePortList = (err, ports) => {
	console.log("generatePortList");
	let portList = document.querySelector("#portList");
	if (ports.length <= 1) {
		let node = document.createElement("p");
		node.value = "No Serial Ports!"
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
	let sPort = new SerialPort('/dev/ttyACM0', {
		baudrate: 9600,
		parser: SerialPort.parsers.raw
	});

	sPort.on("open", function () {
	  console.log('open');
	  sPort.on('data', function(data) {
	      var a = packetToFloatArr(data);
	      console.log(a[8]);
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

window.onload = init;
