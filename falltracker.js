var account_sid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var auth_token = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY";
var twilio_num = "5558675309";
var number = "55555555555"; // The number you want to text the information to

var client = require('twilio')(account_sid, auth_token);
var accel = require("accel-mma84").use(tessel.port["A"]);

var last_movement = 0.0;
var last_movement_time = Date.now();

// Initialize the accelerometer.
accel.on("ready", function () {
  // Stream accelerometer data
  accel.setOutputRate(1.56, function rateSet() {
    accel.setScaleRange( 8, function scaleSet() {
      accel.on("data", function (xyz) {
        if( last_movement !== xyz[0].toFixed(1) ) {
          last_movement = xyz[0].toFixed(1);
          var minutes = ( (Date.now() -  last_movement_time)/1000) / 60 ;
          last_movement_time = Date.now();
          if( minutes > 5 ) {
            // send text
            sendText( number, twilio_num, "You have a fall alarm " + Math.round( minutes ) + " minutes");
          }
        }
      });
    });
  });
});

accel.on("error", function(err){
  console.log("Error:", err);
});

function sendText(to,from,msg) {
  client.sms.messages.create({
    to: to,
    from: from,
    body:msg
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);

      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.', error);
    }
  });
}
