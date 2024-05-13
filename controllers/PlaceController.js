const { default: mongoose } = require("mongoose");
const Place = require("../model/PlaceModel");
const cloudinary = require("../utils/cloudinary");

// Function to upload a base64-encoded image to Cloudinary
const uploadBase64ImageToCloudinary = (base64Image) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: "image",
      folder: "your_folder_name", // Optional: Set the folder where you want to store the image in Cloudinary
    };

    cloudinary.uploader.upload(base64Image, uploadOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
};

// Function to upload an array of base64-encoded images to Cloudinary
const uploadMultipleBase64ImagesToCloudinary = async (base64Images) => {
  const cloudinaryUrls = [];

  const uploadPromises = base64Images.map((base64Image) => {
    return uploadBase64ImageToCloudinary(base64Image)
      .then((cloudinaryUrl) => cloudinaryUrls.push(cloudinaryUrl))
      .catch((error) =>
        console.error("Error uploading image to Cloudinary:", error)
      );
  });

  await Promise.all(uploadPromises);

  return cloudinaryUrls;
};

// ~ add new Place
const addPlace = async (req, res) => {
  const {
    owner,
    title,
    description,
    price,
    checkIn,
    checkOut,
    maxGuests,
    perks,
    address,
    extraInfo,
  } = req.body;

  const base64Images = req.body.photos || [];
  const cloudinaryUrls = await uploadMultipleBase64ImagesToCloudinary(
    base64Images
  );

  const place = new Place({
    owner,
    title,
    address,
    price,
    photos: cloudinaryUrls,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  });
  try {
    const savedPlace = await place.save();
    res.json(savedPlace);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ~ get all places
const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 }).populate("owner");
    res.status(200).json(places);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ~ get place by id
const getPlaceById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }
  try {
    const place = await Place.findOne({ _id: id }).populate("owner");
    res.status(200).json(place);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ~ get user places
const getUserPlaces = async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("Invalid ID");
  }
  try {
    const places = await Place.find({ owner: userId })
      .sort({ createdAt: -1 }).populate("owner");
    res.status(200).json(places);
  } catch (err) {
    res.status(400).json(err);
  }
};

// // ~ non logged in user places
// const getNonLoggedInUserPlaces = async (req, res) => {
//   const userId = req.params.userId;
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(404).send("Invalid ID");
//   }
//   try {
//     const places = await Place.find({ owner: userId }).sort({ createdAt: -1 });
//     res.status(200).json(places);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// ~ update place by id
const updatePlace = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }
  const place = await Place.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      address: req.body.address,
      price: req.body.price,
      photos: req.body.photos,
      description: req.body.description,
      perks: req.body.perks,
      extraInfo: req.body.extraInfo,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      maxGuests: req.body.maxGuests,
    },
    { new: true }
  );
  res.status(200).json(place);
};

// ~ delete a place
const deletePlace = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Invalid ID");
  }
  const place = await Place.findByIdAndRemove(id);
  res.status(200).json(place);
};

module.exports = {
  // uploadByLink,
  // upload,
  addPlace,
  getAllPlaces,
  getUserPlaces,
  updatePlace,
  deletePlace,
  getPlaceById,
  // getNonLoggedInUserPlaces,
};
