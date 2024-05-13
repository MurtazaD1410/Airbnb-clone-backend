const { addBooking, getAllBookings, deleteBooking, getPlaceBookings } = require("../controllers/BookingController");

const router = require("express").Router(); 


// | add new Booking
router.post("/new", addBooking);

// | get all Bookings
router.get("/:id", getAllBookings);

// | delete by id
router.delete("/:id", deleteBooking);

// | get place Bookings
router.get("/place/:id", getPlaceBookings);

module.exports = router;