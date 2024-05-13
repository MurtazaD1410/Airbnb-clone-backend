const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");



// ^ add new booking mail using gmail account

const sendMail = async (req, res) => {
  const { userEmail, userName, checkIn, checkOut, totalPrice, place } =
    req.body;

  // console.log(req.body);

  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Airbnb",
      link: `${process.env.REACT_URL}`,
    },
  });

  let response = {
    body: {
      name: `${userName}`,
      intro: "Booking has been confirmed",
      table: {
        data: [
          {
            item: `${place}`,
            checkIn: `${checkIn}`,
            checkOut: `${checkOut}`,
            price: `₹${totalPrice}`,
          },
        ],
      },
      description:`Your stay has been confirmed at the ${place} from ${checkIn} to ${checkOut}. The total price for your stay is ₹${totalPrice}.`,
      outro: "Thank you for using our service!",
    },
  };
  let mail = mailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL_ADDRESS,
    to: userEmail,
    subject: "Booking",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.json({
        booking: "success",
        message: "mail is sent successfully",
      });
    })
    .catch((err) => {
      return res.json({ err, message: "mail is not sent" });
    });
};

module.exports = {
  sendMail,
};
