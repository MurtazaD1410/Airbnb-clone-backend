// ? Validation
const Joi = require("@hapi/joi");

//| regiter validation
const registerValidation = (data) => {
  const schema = Joi.object({
    photo: Joi.string().optional(),
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// | login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// | update validation
const updateValidation = (data) => {
  const schema = Joi.object({
    photo: Joi.string().optional(),
    name: Joi.string().min(6).optional(),
    email: Joi.string().min(6).email(),
  });
  return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.updateValidation = updateValidation;
