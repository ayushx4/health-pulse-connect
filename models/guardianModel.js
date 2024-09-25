const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const isAdult = (dateOfBirth) => {
  const ageDifMs = Date.now() - dateOfBirth.getTime()
  const ageDate = new Date(ageDifMs)
  const age = Math.abs(ageDate.getUTCFullYear() - 1970)
  return age >= 18
}

const guardianSchema = mongoose.Schema({

  isProfileComplete: {
    type: Boolean,
    required: true,
    default: false
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  date_of_birth: {
    type: Date,
    validate: {
      validator: isAdult,
      message: 'Guardian must be at least 18 years old', // Error message
    },
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    unique: true,
    sparse: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'] 
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patient',
    }
  ]
}, { timestamps: true })

guardianSchema.pre("save", async function(next) {

  if(this.isNew)
    return next()

  if (!this.isModified("password")) 
    return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

guardianSchema.pre("save", function(next) {

  const requiredFields = ['name', 'surname', 'date_of_birth', 'address', 'phoneNumber']
  const isComplete = requiredFields.every(field => !!this[field])

  this.isProfileComplete = isComplete
  next()
})

guardianSchema.methods.validatePassword = async function(inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password)
  
  if (!isMatch)
    throw new Error('Invalid email or password')
  
  return this 
}

guardianSchema.methods.generateAccessToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
  }
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

const GuardianModel = mongoose.model("guardian", guardianSchema)
module.exports = GuardianModel