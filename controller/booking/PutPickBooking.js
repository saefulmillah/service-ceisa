'use strict'

var Booking = require('../../model/booking.js')

exports.put_pick_booking = async function (req, res) {
  var a = req.body
  let p1 = await Booking.update_booking(a, res)
  // console.log(a)
  // console.log("p1 >", p1)

  Booking.insert_order(a, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
      // console.log("result insertOrder >", result)
    }
  })
}