const GuardianModel  = require('../models/guardianModel')

async function updateGuardianProfile(req, res) {
  try {
    const guardianId = req.user.id
    const data = req.body

    const guardian = await GuardianModel.findById(guardianId)
    if (!guardian) 
      return res.status(404).json({ message: 'Guardian not found.' })

    const updatedFields = {}

    if (data.name) updatedFields.name = data.name
    if (data.surname) updatedFields.surname = data.surname
    if (data.date_of_birth) updatedFields.date_of_birth = new Date(data.date_of_birth)
    if (data.address) updatedFields.address = data.address
    if (data.phoneNumber) updatedFields.phoneNumber = data.phoneNumber

    if (Object.keys(updatedFields).length === 0) 
      return res.status(400).json({ message: 'No fields provided to update.' })

    Object.keys(updatedFields).forEach(feild => {
      guardian[feild] = updatedFields[feild]
    })

    const requiredFields = ['name', 'surname', 'date_of_birth', 'address', 'phoneNumber']
    guardian.isProfileComplete = requiredFields.every( field => !!guardian[field])

    await guardian.save()

    return res.status(200).json({
      message: 'Profile updated successfully',
      updatedGuardian: guardian
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  updateGuardianProfile
}