const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../model/UserModel");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "832497118522-d8gnd99aat5j83rndv8sdhdcvd3bktse.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          // console.log("user is: ", currentUser);
          return done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatarUrl: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              // console.log("created new user: ", newUser);
              return done(null, newUser);
            });
        }
      });
    }
  )
);
