const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "place",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    guests: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bookingName: {
      type: String,
      required: true,
    },
    bookingEmail: {
      type: String,
      required: true,
    },
  }, { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;