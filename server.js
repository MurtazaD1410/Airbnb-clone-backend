const express = require("express");
const dotenv = require("dotenv");
// const stripe = require("stripe");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passportSetup = require("./middleware/passport");
const userRoutes = require("./routes/User");
const authRoutes = require("./routes/Auth");
const placeRoutes = require("./routes/Place");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const BookingRoutes = require("./routes/Booking");
const MailRoutes = require("./routes/Mail");
const app = express();

dotenv.config();

const stripe = require("stripe")(
  "sk_test_51KE8wcSJ7kFEPi0TNlwLY9kH0USATnYpnZDzeg26RLAQ0X91EV59Ar9AthyF6QKzTbL41QqS9BRdlQHyRzcpXcer00ZM9cRLvZ"
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cookieSession({
    name: "token",
    keys: ["mynameisdhariwala"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/place", placeRoutes);
app.use("/booking", BookingRoutes);
app.use("/mail", MailRoutes);

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MongoDB!");
});

// ~payment

// app.post("/payment", async (req, res) => {
//   const { price, days, title, fee } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: title,
//             },
//             unit_amount: price * 100,
//           },
//           quantity: days,
//         },
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: "Airbnb Service Fee",
//             },
//             unit_amount: fee * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       payment_method_types: ["card", "google_pay"],
//       mode: "payment",
//       success_url: `${process.env.REACT_URL}/success`,
//       cancel_url: `${process.env.REACT_URL}/cancel`,
//     });

//     res.json({
//       url: session.url,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.post("/payment", async (req, res) => {
  const { price, days, title, fee } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: title,
            },
            unit_amount: price * 100,
          },
          quantity: days,
        },
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Airbnb Service Fee",
            },
            unit_amount: fee * 100,
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.REACT_URL}/success`,
      cancel_url: `${process.env.REACT_URL}/cancel`,
    });
    // console.log(session)

    res.json({
      url: session.url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
