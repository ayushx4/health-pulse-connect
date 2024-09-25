const { google } = require('googleapis')
const oauth2Client = require("../config/googleConfig")

const GuardianModel = require('../models/guardianModel')
const DoctorModel = require('../models/doctorModel')

const { verifyOtp, sendOtpViaMail } = require('../services/otpService')

async function getGoogleUserDetail (code){

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2'})

  

  console.log(` oauth2 is =>> ${JSON.stringify(oauth2.userinfo)}`)

  const { data } = await oauth2.userinfo.get()
  console.log(`data is ${JSON.stringify(data)}`)
  return data
}

async function createAccount(model, email, password) {
  const existingAccount = await model.findOne({ email })
  if (existingAccount) 
    throw new Error("An account with the provided email already exists")
  
  const newAccount = new model({
    email,
    password
  })
  await newAccount.save()
  
  return newAccount
}

async function sendGuardianSignupOtp(req, res) {
  try {
    const { email, password }= req.body

    const existingRecord = await GuardianModel.findOne({ email })
    if(existingRecord) 
      throw new Error("An account with the provided email already exists")

    await sendOtpViaMail(email, password)

    return res.status(200).json({ message: "OTP sent to the provided email"})

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
async function sendDoctorSignupOtp(req, res) {
  try {
    const { email, password }= req.body

    const existingRecord = await DoctorModel.findOne({ email })
    if(existingRecord) 
      throw new Error("An account with the provided email already exists")

    await sendOtpViaMail(email, password)

    return res.status(200).json({ message: "OTP sent to the provided email"})

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
async function verifyOtpAndCreateGuardian (req, res) {
  try {
    const { email, otp}= req.body

    const verifiedOtpRecord  = await verifyOtp(email, otp)

    const createdAccount = await createAccount(GuardianModel, verifiedOtpRecord.email, verifiedOtpRecord.password)
    const accessToken = await createdAccount.generateAccessToken()

    return res.status(200).json({ accessToken, message: "Guardian account created successfully" })

  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

async function verifyOtpAndCreateDoctor (req, res) {
  try {
    const { email, otp }= req.body

    const verifiedOtpRecord = await verifyOtp(email, otp)

    const createdAccount = await createAccount(DoctorModel, verifiedOtpRecord.email, verifiedOtpRecord.password)
    const accessToken = await createdAccount.generateAccessToken()

    return res.status(200).json({ accessToken, message: "Guardian account created successfully" })

  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}


async function guardianLogin(req, res) {
  try{
    const { email, password }= req.body
    if(!email || !password)
      throw new Error("Email and Password are required")

    const guardian = await GuardianModel.findOne({ email })
    if (!guardian) 
      throw new Error('No account found with this email')

    await guardian.validatePassword(password)

    const accessToken = await guardian.generateAccessToken()

    return res.status(200).json({ accessToken, message: "Login successfully" })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

async function doctorLogin(req, res) {
  try{
    const { email, password }= req.body
    if(!email || !password)
      throw new Error("Email and Password are required")

    const doctor = await DoctorModel.findOne({ email })
    if (!doctor) 
      throw new Error('No account found with this email')

    await doctor.validatePassword(password)

    const accessToken = await doctor.generateAccessToken()

    return res.status(200).json({ accessToken, message: "Login successfully" })

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  sendGuardianSignupOtp,
  sendDoctorSignupOtp,
  verifyOtpAndCreateGuardian,
  verifyOtpAndCreateDoctor,
  guardianLogin,
  doctorLogin
}