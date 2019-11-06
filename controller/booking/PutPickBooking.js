'use strict'

var Booking = require('../../model/booking.js')

exports.insert_order = function(req, res) {
  var a = req.body
  console.log(a)
  // return
  Booking.insertOrder(a, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })

  Booking.updateBooking(a)
}

exports.update_booking = function(req, res) {
  var a = req.body
  console.log(a)
  return

  Booking.updateBooking(a, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
}