const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "drlr202ql",
  api_key: "226648772727423",
  api_secret: "g_YBk5BPaFyjVmq-m7GrVF4ahxY",
});

module.exports = cloudinary;