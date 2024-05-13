const { sendMail } = require("../controllers/MailController");
const router = require("express").Router();



// ^ mail using gmail account
router.post('/success', sendMail)

module.exports = router;