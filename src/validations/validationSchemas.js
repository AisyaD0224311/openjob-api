"const Joi = require('joi')";

const UserSchema = Joi.object({
  fullname: Joi.string().optional(),
  name: Joi.string().optional(),
  username: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
<truncated,1574:bytes})