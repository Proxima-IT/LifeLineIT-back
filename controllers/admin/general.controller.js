const sanitize = require("mongo-sanitize")
const General = require("@models/General")
const { get } = require("mongoose")

exports.addGeneralSettings = (req, res) => {
  const data = sanitize(req.body)
  const addData = new General(data)
  addData.save()
  res.json({ message: "Success" })
}

exports.getGeneralSettings = async (req, res) => {
  try {
    const getData = await General.find({}).lean()
    res.json(getData)
  } catch (error) {
    console.log(error)
  }
}
