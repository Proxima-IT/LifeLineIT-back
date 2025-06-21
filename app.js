const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

// General Routes
const authRoutes = require("./routes/auth")
const courseRoutes = require("./routes/courses")
const paymentRoutes = require("./routes/payment")

// Admin Routes
const ADMIN = require("./routes/admin/ADMIN")

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(morgan("dev"))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/payment", paymentRoutes)

// ADMIN Routes
app.use("/api/admin/", ADMIN)

app.get("/", (req, res) => {
  res.send("API is running")
})

app.use((req, res, next) => {
  // check if node env is development, do new error and if not, use the error from the next middleware
  const error =
    process.env.NODE_ENV === "development"
      ? new Error().stack
      : "Route not found"
  error.status = 404
  next(error)
})

module.exports = app
