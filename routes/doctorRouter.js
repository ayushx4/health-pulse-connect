const express = require('express')
const { verifyOtpAndCreateDoctor, sendDoctorSignupOtp, doctorLogin, } = require('../controllers/authController')
const { updateDoctorProfile } = require('../controllers/doctorController')

const router = express.Router()

router.post('/otp/verify', verifyOtpAndCreateDoctor)
router.post('/signup', sendDoctorSignupOtp)
router.post('/login', doctorLogin)
router.patch('/profile', updateDoctorProfile)

module.exports = router