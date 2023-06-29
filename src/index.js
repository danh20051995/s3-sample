const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  override: true
})

const express = require('express')
const routes = require('./routes')

const app = express()

// support parsing of application/json type post data
app.use(express.json())

// support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)
app.use('/', express.static(path.join(__dirname, '../public')))

// handle 404
app.use((req, res, next) => {
  return res.status(404).json({
    message: `Unknown path components: ${req.url}`
  })
})

// handle error with status code
app.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  })
})

// server listening to port
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
