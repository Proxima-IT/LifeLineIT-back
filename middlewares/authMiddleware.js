const jwt = require("jsonwebtoken")

exports.verifyJWT = (req, res, next) => {
  const token = req.cookies.token // stored as HttpOnly cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // user info like name, email, etc.
    next()
  } catch (err) {
    console.log(err)
    return res.status(403).json({ message: "Forbidden" })
  }
}
