
'use strict';
module.exports = function(app) {
  var booking = require('../controller/booking/PutRequestBooking');

  // booking Routes
  app.route('/booking')
    .post(booking.putRequestBooking);
};

