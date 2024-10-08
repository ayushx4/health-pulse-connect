const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const isAdult = (dateOfBirth) => {
  const ageDifMs = Date.now() - dateOfBirth.getTime()
  const ageDate = new Date(ageDifMs)
  const age = Math.abs(ageDate.getUTCFullYear() - 1970)
  return age >= 18
}

const doctorSchema = new mongoose.Schema({
  approval_status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
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
    validate:{
      validator: isAdult,
      message: 'Guardian must be at least 18 years old',
    }
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
    sparse: true, // This ensures that the uniqueness constraint only applies to non-null values
    match: [/^\d{10}$/, 'Phone number must be 10 digits'] 
  },
  registration: {
    establishment_name: {
      type: String,
    },
    registration_number: {
      type: String,
    },
    registration_council: {
      type: String,
    },
    place_of_establishment: {
      type: String,
    },
    id_image: {
      type: String,
    },
    selfie_image: {
      type: String,
    }
  },
  verified:{
    type: Boolean,
    default: false
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient'
  }]
}, { timestamps: true})

doctorSchema.pre("save", async function (next) {

  if(this.isNew)
    return next()

  if (!this.isModified("password")) 
    return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

doctorSchema.pre("save", function(next) {

  const requiredFields = ['name', 'surname', 'address', 'phoneNumber']
  const isComplete = requiredFields.every(field => !!this[field])
  this.isProfileComplete = isComplete
  next()
})

doctorSchema.methods.validatePassword = async function(inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password)
  
  if (!isMatch)
    throw new Error('Invalid email or password')
  
  return this
}

doctorSchema.methods.generateAccessToken = function (){
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

const Doctor = mongoose.model('Doctor', doctorSchema)
module.exports = Doctor