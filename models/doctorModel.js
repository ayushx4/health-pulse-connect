const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true
  },
  profilePicture: {
    type: String, // URL or path to the profile picture
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
