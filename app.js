const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

// Routes
const authRoutes = require("./routes/auth")
const courseRoutes = require("./routes/courses")
const paymentRoutes = require("./routes/payment")
const studentRoutes = require("./routes/student")

const app = express()

app.use(helmet())
app.use(morgan("dev"))
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://lifelineit-d5cbf.web.app/",
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use(express.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(express.json()) // application/json

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/student", studentRoutes)

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

module.exports = app
