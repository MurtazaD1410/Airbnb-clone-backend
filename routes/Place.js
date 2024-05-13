const router = require("express").Router();
const {
  addPlace,
  getUserPlaces,
  updatePlace,
  deletePlace,
  getAllPlaces,
  // getNonLoggedInUserPlaces,
  getPlaceById,
} = require("../controllers/PlaceController");

// | add new Place
router.post("/new", addPlace);

// | get all Places
router.get("/", getAllPlaces);

// | get all user Places
router.get("/user/:userId", getUserPlaces);

// // | get all non Loged In user Places
// router.get("/user/account/:userId", getNonLoggedInUserPlaces);

// | get Place by id
router.get("/:id", getPlaceById);

// | update Place by id
router.patch("/:id", updatePlace);

// |  delete by id
router.delete("/:id", deletePlace);

module.exports = router;
