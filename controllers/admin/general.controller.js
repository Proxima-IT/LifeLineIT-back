const sanitize = require("mongo-sanitize")
const General = require("@models/General")
const { get } = require("mongoose")

exports.addGeneralSettings = async (req, res) => {
  try {
    const data = sanitize(req.body)

    const result = await General.findOneAndUpdate(
      {},
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true } // options
    )

    res.json({ message: "Success", data: result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error", error })
  }
}

exports.getGeneralSettings = async (req, res) => {
  try {
    const getData = await General.find({}).lean()
    res.json(getData[0])
  } catch (error) {
    console.log(error)
  }
}
