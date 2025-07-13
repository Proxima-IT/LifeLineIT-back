console.clear()
const app = require("./app")
const connectDB = require("./utils/connectDB")
require("dotenv").config()

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    )
  })
  .catch((err) => console.error(err))
