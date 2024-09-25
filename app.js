const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const dbConnectoin = require('./config/dbConnection')
const { guardianRouter, doctorRouter } = require('./routes/index')
const { authenticateJwt } = require('./middleware/authMiddleware')

const PORT = process.env.PORT || 3000
const app = express()

dbConnectoin(process.env.DB_URL)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/guardian', authenticateJwt, guardianRouter)

app.use('/api/v1/doctor', authenticateJwt, doctorRouter)

app.listen(PORT, ()=> console.log(`Server listening on Port ${PORT}`))