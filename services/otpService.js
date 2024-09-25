const otpModel = require('../models/otpModel')
const { sendMail } = require('../utils/emailUtils')

const sendOtpViaMail = async (email, password) => {
  if (!email || !password) 
    throw new Error("Email and password are required")

  const otp = Math.floor(1000 + Math.random() * 9000)

  const deletedDocument = await otpModel.findOneAndDelete({ email })

  const otpGenerate = new otpModel({
    email,
    otp,
    password
  })
  await otpGenerate.save()

  const emailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'HealthPulseConnect OTP verification',
    text: `Your OTP for HealthPulseConnect is ${otp}. Please enter this code to verify your email. It is valid for 10 minutes.`
  }
  await sendMail(emailOptions)

  return true
}

const verifyOtp = async (email, otp) => {
  if (!email || !otp) 
    throw new Error("Email and OTP are required")

  const otpRecord = await otpModel.findOne({ email })
  if (!otpRecord) 
    throw new Error('No OTP found for the provided email')

  const isValid = await otpRecord.verifyOtp(otp)
  if (!isValid) 
    throw new Error("Invalid OTP")

  const verifiedOtpRecord = await otpModel.findOneAndDelete({ email })

  return verifiedOtpRecord
}



module.exports = {
  sendOtpViaMail,
  verifyOtp
}