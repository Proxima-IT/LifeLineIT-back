const { createClient } = require("redis")
require("dotenv").config()

const client = createClient({
  url: process.env.REDIS_URI || "redis://redis:6379",
})

client.connect()
client.on("connect", () => {
  console.log("Redis has been connected")
})

client.on("error", (err) => {
  console.error("Redis error:", err)
})

module.exports = client
