const router = require("express").Router();
const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const {
  registerValidation,
  loginValidation,
  updateValidation,
} = require("../middleware/validation");
const jwtSecret = "incuibdbcuvucudcnujdnujdcn";
const Place = require("../model/PlaceModel");
const cloudinary = require("../utils/cloudinary");

// REGISTER
router.post("/register", async (req, res) => {
  // ? Validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log("hello");

  // ? Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // ? Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // console.log(req.body);

  // ? create a new user
  const result = await cloudinary.uploader.upload(req.body.photo, {
    folder: "avatars",
  });
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    avatarUrl: result.secure_url,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  // ? Validate the data before we login a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // ? Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("There is no account with that email");

  // ? checking if user has previosly loged in with google with same email
  if (user.googleId) {
    return res.status(400).send("Please login with google");
  }

  // ? Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  // ? Create and assign a token
  jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    jwtSecret,
    { expiresIn: 30 * 24 * 60 * 60 * 1000 },
    (err, token) => {
      if (err) return res.status(400).send(err.message);
      res.cookie("token", token).json(user);
    }
  );
});

// PROFILE
router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) return res.status(400).send(err.message);
      const { name, email, _id, avatarUrl } = await User.findById(user.id);
      res.json({ name, email, _id, avatarUrl });
    });
  } else {
    res.json(null);
  }
});

// UPDATE
router.put("/update/:userid", async (req, res) => {
  const { userid } = req.params;

  // ? Validate the data before we login a user
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(userid)) {
    return res.status(404).send("Invalid ID");
  }

  // delete previous photo from cloudinary
  const userDetails = await User.findById(userid);

  const imgUrl = userDetails.avatarUrl;
  await cloudinary.uploader.destroy(imgUrl);

  const result = await cloudinary.uploader.upload(req.body.photo, {
    folder: "avatars",
  });

  const user = await User.findByIdAndUpdate(
    userid,
    {
      name: req.body.name,
      email: req.body.email,
      avatarUrl: result.secure_url,
    },
    { new: true }
  );

  

  res.status(200).json(user);
});



// DELETE
router.delete("/delete/:userid", async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  await Place.deleteMany({ owner: userid });
  res.status(200).send("User deleted");
});

// LOGOUT
router.get("/logout", async (req, res) => {
  res.cookie("token", "").redirect(process.env.REACT_URL);
});

module.exports = router;
