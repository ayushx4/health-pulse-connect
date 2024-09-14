const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const { userRouter, doctorRouter } = require('./routes/index')

const PORT = process.env.PORT || 3000
const app = express()


app.use(cors())
app.use(express.json())

app.use('/api/v1/user', userRouter)

app.use('/api/v1/doctor', doctorRouter)

app.listen(PORT, ()=> console.log(`Server listening on Port ${PORT}`))