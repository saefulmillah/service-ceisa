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
		company : 23,
		reff_no_int : query.idRequestBooking,
		booking_date : query.booking_date, 
		origin_name : query.POD,
		destination_name : query.destination, 
		depo_name : query.depo, 
		plan_date : query.plan_date, 
		doc_ref : query.bl_no, 
		doc_date : query.bl_date, 
		sp2_date : query.sp2valid_date, 
		spc_exp_date : query.spcvalid_date,
		update_date : "2019-12-01 13:07:59"
		// booking_no : 		
	}

	console.log(headerBooking);

	sql.query("SELECT * FROM tbooking WHERE reff_no_int = ?", query.idRequestBooking, function (err, res) {
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
		console.log('this.sql', this.sql) //command/query
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
	        	let FieldforHitAPI02 = {
	        		idRequestBooking : headerBooking.idRequestBooking,
	        		idServiceOrder : res.insertId,
	        		hargaPenawaran : 5000000,
	        		waktuPenawaran : "2019-09-08 14:00:00",
	        		timestamp : "2019-09-08 14:00:00", 
	        		payment_method : [{
								                    "method" : "Credit card",
								                    "channel" : "BNI",
								                    "idRequestBooking" : headerBooking.idRequestBooking
								                },
										{
								                   "method" : "Credit card",
								                    "channel" : "Mandiri",
								                    "idRequestBooking" : headerBooking.idRequestBooking
								                },
										{
								                   "method" : "Virtual Account",
								                    "channel" : "Mandiri",
								                    "idRequestBooking" : headerBooking.idRequestBooking
										},
										{
								                   "method" : "Virtual Account",
								                    "channel" : "BNI",
								                    "idRequestBooking" : headerBooking.idRequestBooking
										},
										{
								                   "method" : "Store",
								                    "channel" : "Indomart",
								                    "idRequestBooking" : headerBooking.idRequestBooking
										},
										{
								                   "method" : "e-Wallet",
								                    "channel" : "Doku",
								                    "idRequestBooking" : headerBooking.idRequestBooking
										},
										{
								                   "method" : "e-Wallet",
								                    "channel" : "Link Aja",
								                    "idRequestBooking" : headerBooking.idRequestBooking
										}	
									]
	        	}
	        	// console.log(FieldFromHeader)
	            result(null, res.insertId)
	            InsDetailBooking(FieldFromHeader)
	            hitAPI02(FieldforHitAPI02, null)
	        }
	    })
	}

	function hitAPI02(headerBooking) {
		var b = headerBooking
		console.log(b)
		// return
		var request = require("request")
		var options = {
			method: 'POST',
		  	url: 'https://esbbcext01.beacukai.go.id:8082/DetilBooking',
		  	headers: { 
		  				'cache-control': 'no-cache',
		     			'Content-Type': 'application/json' 
		     		},
			body: b,
			json: true 
		}

		// request(options, function (error, response) {
		// 	if (error) {
		// 		result(error, null)
		// 	} else {
		// 		result(null, response.body)
		// 		console.log("response >", response.body)
		// 	}
		// })

		console.log("request >", options)
		console.log("result >", request(options))
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
			}))

			Promise.all(promises).then(result => {
				sql.release
			})
		})
    }

}

Booking.update_booking = function (query) {
	var a = query
	var q = "UPDATE tbooking SET booking_status = ?, payment_method = ?, payment_channel = ? WHERE idRequestBooking = ?"
	// var q = "UPDATE tbooking SET booking_status = ?, payment_method = ? WHERE idRequestBooking = ?"

	sql.query(q, [1, a.idRequestBooking, a.payment_method, a.payment_channel])
}

Booking.insert_order = function (query, result) {
	// return new Promise(resolve => {
		var a = query
		var q = "INSERT INTO torder (order_date, booking) SELECT ?, id FROM `tbooking` WHERE idRequestBooking = ? AND booking_status = 0"

		sql.query(q, [new Date(), a.idRequestBooking], function (err, res) {
			
			if (err) 
				result(err, null)
			console.log(res.affectedRows)
			if (res.affectedRows==0) {
				result(null, {
					message : 'ID REQUEST BOOKING TIDAK ADA ATAU SUDAH DIPILIH',
					status : 'ERROR',
					data : res
				})
			} else {
				result(null, {
					message : 'BOOKING DITEMUKAN DAN DI UPDATE',
					status : 'SUCCESS',
					data : res
				})
				Booking.update_booking(query)
			}
		})
	// })
}

Booking.get_confirm_payment = function (query, result) {
	var msg_order_status = ""
	var message = ""
	var status = ""
	var idRequestBooking = ""
	var a = query
	var q = "SELECT * FROM tbooking a INNER JOIN torder b WHERE a.id=b.booking AND a.idRequestBooking = ?"
	sql.query(q, [a.idRequestBooking], function (err, res) {
		if (err) {
			result(err, null)
		} else {
			// console.log(res.length)
			// return
			if (res.length > 0) {
				if (res[0].order_status==5) {
					msg_order_status = "PAID"
					message = "BOOKING DITEMUKAN"
					status = "SUCCESS"
					idRequestBooking = res[0].idRequestBooking
				} else {
					message = "BOOKING DITEMUKAN"
					msg_order_status = "UNPAID"
					status = "SUCCESS"
					idRequestBooking = res[0].idRequestBooking
				}
			} else {
				message = "BOOKING TIDAK DITEMUKAN"
				msg_order_status = ""
				status = ""
				idRequestBooking = ""
			}
			result(null, {
				message : message,
				status : status,
				data : {
						idRequestBooking : idRequestBooking,
						order_status : msg_order_status
					}
			})
		}
	})
}

module.exports = Booking;