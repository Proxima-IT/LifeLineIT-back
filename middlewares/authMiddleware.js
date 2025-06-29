const jwt = require("jsonwebtoken")

exports.verifyJWT = (req, res, next) => {
  const token = req.cookies.token // stored as HttpOnly cookie
  if (!token)
    return res.status(200).json({ status: false, message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // user info like name, email, etc.
    next()
  } catch (err) {
    return res.status(403).json({ status: false, message: "Forbidden" })
  }
}
