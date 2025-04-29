require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./routes/userRoute')

const app = express()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', (error) => console.log(' DB Error:', error))
db.once('open', () => console.log(' Connected successfully to MongoDB'))

app.use(cors())
app.use(express.json())

app.use('/api/v1/user', userRoute)

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/api/v1/`)
})
