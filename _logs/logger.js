const winston = require("winston")
require("winston-daily-rotate-file")

const path = require("path")

const transport = new winston.transports.DailyRotateFile({
  filename: path.join("logs", "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // compress old logs
  maxSize: "20m", // max file size
  maxFiles: "7d", // keep only last 14 days
})

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    transport,
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
})

module.exports = logger
