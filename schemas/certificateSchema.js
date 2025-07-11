const Joi = require("joi")

const certificateSchema = Joi.object({
  name: Joi.string().trim().required(),
  course: Joi.string().trim().required(),
  grade: Joi.string().trim().required(),
  courseDuration: Joi.string().trim().required(),
  certificateId: Joi.string().trim().required(),
  sid: Joi.string().trim().required(),
  regid: Joi.string().trim().required(),
  instructorName: Joi.string().trim().required(),
})

module.exports = certificateSchema
