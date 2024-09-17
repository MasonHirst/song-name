// ! IMPORTS
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const path = require('path')
const { handleNewSongRequest, handleGetRequests } = require('./utils/requestController')
const db = require('./utils/database/db-config')

//! Middleware
const join = path.join(__dirname, '.', 'build')
app.use(express.static(join))
app.use(express.json())
app.use(cors())

//! Endpoints
app.post('/api/request-song', handleNewSongRequest)
app.post('/api/requests/', handleGetRequests)


//! Serve the client files
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.', 'build', 'index.html'))
})



//! Server listen
const PORT = process.env.PORT
// app.listen(PORT, () =>
//   console.log(`SERVER RUNNING ON SERVER_PORT ${PORT}`)
// )

db.sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`---------------------------SERVER RUNNING ON PORT ${PORT}`)
    )
  })