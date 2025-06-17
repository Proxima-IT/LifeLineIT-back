const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const bodyParser = require("body-parser")

// General Routes
const authRoutes = require("./routes/auth")
const courseRoutes = require("./routes/courses")

// Admin Routes
const ADMIN = require("./routes/admin/ADMIN")

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
app.use(bodyParser.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)

// ADMIN Routes
app.use("/api/admin/", ADMIN)

app.get("/", (req, res) => {
  res.send("API is running")
})

module.exports = app
