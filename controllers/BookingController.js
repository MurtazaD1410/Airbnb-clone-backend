const { default: mongoose } = require("mongoose");
const Booking = require("../model/BookingModel");
// const nodemailer = require("nodemailer");

// ~ add new Booking
const addBooking = async (req, res) => {
  // let testAccount = await nodemailer.createTestAccount();
  const {
    place,

    owner,

    guests,
    checkIn,
    checkOut,
    price,
    bookingName,
    bookingEmail,
  } = req.body;

  const booking = new Booking({
    place,

    owner,

    guests,
    checkIn,
    checkOut,
    price,
    bookingName,
    bookingEmail,
  });
  try {
    const savedBooking = await booking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ~ get all Bookings of the user
const getAllBookings = async (req, res) => {
  const { id } = req.params;
  try {
    const bookings = await Booking.find({ owner: id })
      .sort({ createdAt: -1 })
      .populate("place");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ~ get all Bookings of a particular place
const getPlaceBookings = (req, res) => {
  const { id } = req.params;
  Booking.find({ place: id })
    .then((bookings) => res.json(bookings))
    .catch((err) => res.status(400).json("Error: " + err));
};

// ~ delete Booking by id
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }
  await Booking.findByIdAndDelete(id);
  res.status(200).json("Booking deleted successfully");
};

module.exports = {
  addBooking,
  getAllBookings,
  deleteBooking,
  getPlaceBookings,
};
