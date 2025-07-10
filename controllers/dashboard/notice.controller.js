const Notice = require("../../models/Notice")
const sanitize = require("mongo-sanitize")
const client = require("../../utils/redisClient")

// Add Notice
exports.addNotice = async (req, res) => {
  try {
    const newNotice = new Notice(sanitize(req.body))
    await newNotice.save()
    return res.json({
      success: true,
      message: "Notice was added successfully.",
    })
  } catch (error) {
    console.log(error)
    return res.json({ err: error.message })
  }
}

// View Notice
exports.viewNotice = async (req, res) => {
  try {
    const CACHE_KEY = "notices"
    const cachedData = await client.get(CACHE_KEY)

    if (cachedData) {
      console.log("Inside CachedData")
      return res.json(JSON.parse(cachedData))
    }

    const getAllNotices = await Notice.find({})

    await client.set(CACHE_KEY, JSON.stringify(getAllNotices), { EX: 60 })
    return res.json(getAllNotices)
  } catch (error) {
    console.log(error)
    return res.json({ err: error.message })
  }
}
