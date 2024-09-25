const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const otpSchema= mongoose.Schema({
  email: {
    type: String,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  otp: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    expires: 300,  // TTL in seconds (300 seconds = 5 minutes)
    default: Date.now
  }
}, { timestamps: true })

otpSchema.pre("save", async function (next) {
  this.otp = await bcrypt.hash(this.otp.toString(), 10)
  this.password= await bcrypt.hash(this.password.toString(), 10)
  next()
})

otpSchema.methods.verifyOtp = async function (otp) {
  return await bcrypt.compare(otp.toString() , this.otp)
}

const OtpModel = mongoose.model("otp", otpSchema)
module.exports = OtpModel