console.clear()
const app = require("./app")
const mongoose = require("mongoose")
const connectDB = require("./utils/connectDB")
require("dotenv").config()

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error(err))
