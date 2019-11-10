'use strict'

var Booking = require('../../model/booking.js')

exports.getConfirmPayment = async function (req, res) {
  var a = req.body
  // console.log(a)
  // console.log("p1 >", p1)

  Booking.get_confirm_payment(a, function (err, result) {
    if (err) {
      res.json(err)
    } else {
      res.json({
        status : result.status,
        message : result.message,
        data : result.data
      })
      // console.log("result insertOrder >", result)
    }
  })
}