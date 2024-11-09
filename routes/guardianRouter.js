const express = require('express');
const {
  guardianLogin,
  verifyOtpAndCreateGuardian,
  sendGuardianSignupOtp,
} = require('../controllers/authController');
const { updateGuardianProfile } = require('../controllers/guardianController');

const router = express.Router();

router.post('/otp/verify', verifyOtpAndCreateGuardian);
router.post('/signup', sendGuardianSignupOtp);
router.post('/login', guardianLogin);
router.patch('/profile', updateGuardianProfile);

module.exports = router;
