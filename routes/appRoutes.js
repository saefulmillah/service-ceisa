
'use strict'
module.exports = function(app) {
  var booking = require('../controller/booking/PutRequestBooking')
  var put_pick_booking = require('../controller/booking/PutPickBooking')
  var get_confirm_payment = require('../controller/booking/GetConfirmPayment')

  // booking Routes
  app.route('/booking')
    .post(booking.putRequestBooking)
  app.route('/booking/put_pick_booking')
  	.post(put_pick_booking.put_pick_booking)
  app.route('/booking/get_confirm_payment')
  	.post(get_confirm_payment.getConfirmPayment)
  app.route('/booking')
  	.get(booking.ujiCoba)
}

