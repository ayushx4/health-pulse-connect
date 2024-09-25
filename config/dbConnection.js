const mongoose = require('mongoose')

const dbConnection = async(dbUrl)=>{
  await mongoose.connect(dbUrl)
  .then(()=> console.log('MongoDB connected...'))
  .catch((error) => console.log(`Getting error to connect MongoDB`))
}

module.exports = dbConnection