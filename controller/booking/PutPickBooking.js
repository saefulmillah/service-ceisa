'use strict'

var Booking = require('../../model/booking.js')

exports.put_pick_booking = function (req, res) {
  var a = req.body
  // let p1 = await Booking.insert_order(a, res)
  // console.log(a)
  // console.log("p1 >", p1)

  Booking.update_booking(a, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      res.json({
        status : result.status,
        message : result.message
      })
      // console.log("result insertOrder >", result)
    }
  })
}