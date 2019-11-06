
'use strict'
module.exports = function(app) {
  var booking = require('../controller/booking/PutRequestBooking')
  var put_pick_booking = require('../controller/booking/PutPickBooking')

  // booking Routes
  app.route('/booking')
    .post(booking.putRequestBooking)
  app.route('/booking/put_pick_booking')
  	.post(put_pick_booking.insert_order)
  app.route('/booking')
  	.get(booking.ujiCoba)
}

