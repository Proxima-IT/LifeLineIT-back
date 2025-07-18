const path = require("path")
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

// Routes
const authRoutes = require("./routes/auth")
const courseRoutes = require("./routes/courses")
const studentRoutes = require("./routes/student")
const dashboardRoutes = require("./routes/dashboard/dashboard")

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://lifelineit-d5cbf.web.app",
  "https://lifelineit-d5cbf.firebaseapp.com",
  ,
  "https://lifeline-it-student-dashboard.web.app",
  "https://lifeline-it-student-dashboard.firebase.app",
]

const corsOptions = {
  origin: allowedOrigins, // function দরকারই নেই
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(morgan("dev"))
app.use(cookieParser())

app.use(express.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(express.json()) // application/json

app.get("/", (req, res) => {
  // Public URL goes here
  res.redirect("https://www.youtube.com")
})
// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/student", studentRoutes)

// Student Dashboard routes
app.use("/api/dashboard", dashboardRoutes)

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

module.exports = app
