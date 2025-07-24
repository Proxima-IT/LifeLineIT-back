// Basic Auth middleware

const basicAuth = require("basic-auth")
const auth = (req, res, next) => {
  const user = basicAuth(req)
  const username = "admin" // 🔒 set your own
  const password = "secret" // 🔒 set your own

  if (!user || user.name !== username || user.pass !== password) {
    res.set("WWW-Authenticate", 'Basic realm="Logs"')
    return res.status(401).send("Authentication required.")
  }
  next()
}

module.exports = auth
