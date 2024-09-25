const mongoose = require("mongoose")

const patientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date, // Date type for proper handling of dates
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"], // Enum for consistent gender values
    required: true,
  },
  health_record: {
    type: String,
    required: true,
  }
}, { timestamps: true })

const PatientModel = mongoose.model("patient", patientSchema)
module.exports = PatientModel