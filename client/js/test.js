var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
	baudrate: 9600,
	parser: SerialPort.parsers.raw
});

port.on("open", function () {
  console.log('open');
  port.on('data', function(data) {
      var smaller = data.slice(0,60);

      var floatarr = new Float32Array(1);

      floatarr[0] |= (data[0] << 24);
      floatarr[0] |= (data[1] << 16);
      floatarr[0] |= (data[2] << 8);
      floatarr[0] |= data[3];

      console.log(floatarr[0].toString());
  });
});
