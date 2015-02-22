var account_sid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var auth_token = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY";
var twilio_num = "5558675309";
var number = "55555555555"; // The number you want to text the information to

var client = require('twilio')(account_sid, auth_token);
var accel = require("accel-mma84").use(tessel.port["A"]);


// fall detected if over moving average of acceleration
// during any 500ms (50 loops of 10ms)
// is less than 1/10th what you would expect
var fall_threshold = 1.0 // if sensor retums m/s^2
//const float fall_threshold = 0.1 // if sensor returns g
var free_fall = 1000.0 // this will decay down


// Initialize the accelerometer.
accel.on("ready", function () {

  // Stream accelerometer data
  accel.setOutputRate(1.56, function rateSet() {
    accel.setScaleRange( 8, function scaleSet() {
      accel.on("data", function (xyz) {
        while( free_fall !== xyz[0].fall_threshold ) {
          sleep_milliseconds(10)
          free_fall = xyz[0].fall_threshold(1);
          var free_fall = (free_fall * 49.0 + sqrt(x^2+y^2+z^2)) / 50.0 ;
            sendText( number, twilio_num, "Your parent may have a fall" );
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
