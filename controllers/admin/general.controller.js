const sanitize = require("mongo-sanitize")
const General = require("@models/General")

exports.addGeneralSettings = (req, res) => {
  const data = sanitize(req.body)
  const addData = new General(data)
  addData.save()
  res.json({ message: "Success" })
}

exports.getGeneralSettings = (req, res) => {
  const getData = General.findOne({}).lean()
  res.json(getData)
}
