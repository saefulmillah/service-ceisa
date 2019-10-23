'use strict';

var Booking = require('../../model/booking.js');

exports.putRequestBooking = function(req, res) {
  var a = req.body
  // console.log(a)
  // return
  Booking.insertRequestBooking(a, function (err, result) {
    if (err) {
      res.send(err);
    } else {
    // console.log('hasil controller : '+result);
      res.status(200).json({
        status : "success",
        data : result
      });
    }
  });

  
};

exports.ujiCoba = function (req, res) {
    console.log("Berhasil");
  // Booking.ujiCoba(function (err, result) {
  //   console.log("Berhasil");
  //   return
  // });
};