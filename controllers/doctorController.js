const DoctorModel = require('../models/doctorModel')

async function updateDoctorProfile(req, res) {
  try {
    const doctorId = req.user.id
    const data = req.body

    const doctor= await DoctorModel.findById(doctorId)
    if (!doctor) 
      return res.status(404).json({ message: 'Doctor not found.' })

    const updatedFields = {}

    if (data.name) updatedFields.name = data.name
    if (data.surname) updatedFields.surname = data.surname
    if (data.date_of_birth) updatedFields.date_of_birth = data.date_of_birth
    if (data.address) updatedFields.address = data.address
    if (data.phoneNumber) updatedFields.phoneNumber = data.phoneNumber

    if (Object.keys(updatedFields).length === 0) 
      return res.status(400).json({ message: 'No fields provided to update.' })

    // Update the guardian's fields with the new data
    Object.keys(updatedFields).forEach(field => {
      doctor[field] = updatedFields[field]
    })

    const requiredFields = ['name', 'surname', 'date_of_birth', 'address', 'phoneNumber']
    doctor.isProfileComplete = requiredFields.every( field => !!updatedFields[field])

    await doctor.save()

    return res.status(200).json({
      message: 'Profile updated successfully',
      updatedDoctor: doctor
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  updateDoctorProfile
}