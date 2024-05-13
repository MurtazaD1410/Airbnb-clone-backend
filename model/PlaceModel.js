const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    // owner: {
    //   type: Object,
    //   ref: "user",
    // },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photos: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    perks: {
      type: Array,
      required: false,
    },
    extraInfo: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Place = mongoose.model("place", placeSchema);

module.exports = Place;
