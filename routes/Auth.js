const router = require("express").Router();
const passport = require("passport");
const User = require("../model/UserModel");
const jwtSecret = "incuibdbcuvucudcnujdnujdcn";
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: "http://localhost:5173",
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    res.redirect(process.env.REACT_URL);
  }
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    jwt.sign(
      {
        email: req.user.email,
        id: req.user._id,
      },
      jwtSecret,
      { expiresIn: 30 * 24 * 60 * 60 * 1000 },
      (err, token) => {
        if (err) return res.status(400).send(err.message);
        res.cookie("token", token).json(req.user);
      }
    );
    // res.json(req.user);
  } else {
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
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).redirect(process.env.REACT_URL);
});

module.exports = router;
