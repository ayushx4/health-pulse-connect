const transporter = require('../config/nodemailerConfig')

async function sendMail (mailOptions) {

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error.message)
    throw error 
  }
}

module.exports = { sendMail }