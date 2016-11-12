//var SerialPort = require('serialport');
//var sPort = new SerialPort('/dev/ttyACM0', {
//	baudrate: 9600,
//	parser: SerialPort.parsers.raw
//});
//
//sPort.on("open", function () {
//  console.log('open');
//  sPort.on('data', function(data) {
//      var a = packetToFloatArr(data);
//      console.log(a);
//  });
//});
//
///**
// * Creates an array of 15 floats from binary buffer of length 60+
// * @param {Buffer} byteData a buffer containing 60 or more bytes to be parsed
// *    into a float array
//
// * @return {Float32Array} 15 floats in a Float32Array
// */
//const packetToFloatArr = (byteData)  => {
//    buffer = byteData.slice(0, 60);
//
//    var lower = 0;
//    var upper = 4;
//
//    var floatArr = new Float32Array(15);
//
//    for (var i = 0; i < 15; i++) {
//        var tmpSlice = buffer.slice(lower,upper);
//        floatArr[i] = tmpSlice.readFloatLE();
//
//        lower += 4;
//        upper += 4;
//    }
//
//    return floatArr;
//};
const tinit = () => {
};


//$(function() {
    var TERM = null;

    $("#arb").terminal(function(c,t) {
        TERM = t;
    }, {
        greeting: false,
        onInit: function(term) {
            TERM = term;
        }
    });
//});

$("#connect").click(function() {
    TERM.echo("WELP");
});


window.onload = tinit;
