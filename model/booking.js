'use strict'
var sql = require('./db.js')

//Constructor
// booking model
var Booking = function (booking) {
	this.id = booking.id;
	this.booking_date = booking.booking_date;
	this.origin = booking.origin;
	this.origin_lat = booking.origin_lat;
	this.origin_lon = booking.origin_lon;
	this.destination = booking.destination;
	this.destiantion_lat = booking.destiantion_lat;
	this.destination_lon = booking.destination_lon;
	this.depo = booking.depo;
	this.depo_lat = booking.depo_lat;
	this.depo_lon = booking.depo_lon;
	this.plan_date = booking.plan_date;
	this.bl_no = booking.bl_no;
	this.bl_date = booking.bl_date;
	this.sp2valid_date = booking.sp2valid_date;
	this.spcvalid_date = booking.spcvalid_date;
	this.update_by = booking.update_by;
	this.update_date = booking.update_date;
}

Booking.insertRequestBooking = function (query, result) {
	// var a = JSON.parse(query);

	// console.log('hasil ='+a);
	// console.log(query);
	// return
	var detailBooking = query.container;
	let headerBooking = {
		customer : 656,
		idRequestBooking : query.idRequestBooking,
		booking_date : query.booking_date, 
		origin : query.POD,
		destination : query.destination, 
		depo : query.depo, 
		plan_date : query.plan_date, 
		bl_no : query.bl_no, 
		bl_date : query.bl_date, 
		sp2valid_date : query.sp2valid_date, 
		spcvalid_date : query.spcvalid_date		
	}

	sql.query("SELECT * FROM tbooking WHERE idRequestBooking = ?", query.idRequestBooking, function (err, res) {
		if (err) {
			result(err, null)
		} else {
			if (res.length < 1) {
				var res_row = {
					message : "ID REQUEST BOOKING BELUM ADA",
					status : "BERHASIL INSERT",
					data : []
				}
				InsHeaderBooking(headerBooking)
			} else {
				var res_row = {
					message : "ID REQUEST BOOKING SUDAH ADA",
					status : "GAGAL INSERT",
					data : res
				}
				result(null, res_row)
			}
		}
	})

	function InsHeaderBooking(headerBooking) {
		sql.query("INSERT INTO tbooking SET ?", headerBooking, function (err, res) {             
	        if(err) {
	            // console.log("error: ", err);
	            result(err, null);
	        } else {
	        	let FieldFromHeader = {
	        		booking_no : res.insertId,
	        		origin : query.POD,
					destination : query.destination, 
					depo : query.depo,
	        	}
	        	// console.log(FieldFromHeader)
	            result(null, res.insertId)
	            InsDetailBooking(FieldFromHeader)
	        }
	    })
	} 

    function InsDetailBooking(FieldFromHeader) {
    	let promises = []
    	var rowFieldFromHeader = FieldFromHeader;

		var ArrBookingDetail = detailBooking.map((resdetailBooking) => { 
			promises.push(new Promise(resolve => {
				let {booking_no, container_no, container_size, container_type} = resdetailBooking
				let detailBooking = {
					booking_no : rowFieldFromHeader.booking_no,
					depo : rowFieldFromHeader.depo,
					origin : rowFieldFromHeader.origin,
					destination : rowFieldFromHeader.destination,
					container_no : container_no,
					container_size : container_size,
					container_type : container_type
				}
				console.log(detailBooking);
				sql.query("INSERT INTO torder_detail SET ?", detailBooking)
				// sql.query("INSERT INTO torder_detail SET ?", detailBooking, function (err, res) {             
			 //        if(err) {
			 //            // console.log("error: ", err);
			 //            result(err, null);
			 //        }
			 //        else{
			 //            result(null, res);
			 //        }
			 //    }); 			
				// console.log(detailBooking);
			}))

			Promise.all(promises).then(result => {
				sql.release
			})
		})
    }

}

Booking.update_booking = function (query) {
	return new Promise(resolve => {
		var a = query
		var q = "UPDATE tbooking SET booking_status = ? WHERE idRequestBooking = ?"

		sql.query(q, [1, a.idRequestBooking], function (err, res) {
			if (err) {
				console.log("error async_1 >", err)
				resolve(err)
			} else {
				resolve(res)
			}
		})
	})
}

Booking.insert_order = function (query, result) {
	var a = query
	var q = "INSERT INTO torder (order_date, booking) SELECT ?, id FROM `tbooking` WHERE idRequestBooking = ? AND booking_status <> 0"

	sql.query(q, [new Date(), a.idRequestBooking], function (err, res) {
		
		if (err) 
			result(err, null)
		console.log(res.affectedRows)
		if (res.affectedRows==0) {
			result(null, {
				message : 'ERROR BOOKING TIDAK DITEMUKAN',
				data : res
			})
		} else {
			result(null, {
				message : 'SUCCESS',
				data : res
			})
		}
	})
}

module.exports = Booking;