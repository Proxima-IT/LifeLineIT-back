const Joi = require("joi")

const registrationCardSchema = Joi.object({
  name: Joi.string().trim().required(),
  father: Joi.string().trim().required(),
  mother: Joi.string().trim().required(),
  gender: Joi.string().trim().required(),
  birthday: Joi.string().trim().required(),
  number: Joi.string().trim().required(),
  registration: Joi.string().trim().required(),
  sid: Joi.string().trim().required(),
})

module.exports = registrationCardSchema
