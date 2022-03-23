const mongoose = require("mongoose");

const Contact = mongoose.model("Contact", {
  nama: {
    type: String,
    require: true,
  },
  nohp: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
});

module.exports = Contact;
