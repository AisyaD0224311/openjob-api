const Joi = require('joi');
const { InvariantError } = require('../utils/exceptions');

const validatePayload = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
    next();
  };
};

const schemas = {
  userRegister: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createCompany: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required() 
  }),

  createCategory: Joi.object({
    name: Joi.string().required()
  }),

  createJob: Joi.object({
    company_id: Joi.string().required(),
    category_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    job_type: Joi.string().required(),         
    experience_level: Joi.string().required(),  
    location_type: Joi.string().required(),     
    location_city: Joi.string().required(),     
    salary_min: Joi.number().integer().required(),
    salary_max: Joi.number().integer().required(), 
    is_salary_visible: Joi.boolean().required(),  
    status: Joi.string().valid('open', 'closed').default('open')
  }),

  updateJob: Joi.object({
    company_id: Joi.string().optional(),
    category_id: Joi.string().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    job_type: Joi.string().optional(),
    experience_level: Joi.string().optional(),
    location_type: Joi.string().optional(),
    location_city: Joi.string().optional(),     
    salary_min: Joi.number().integer().optional(), 
    salary_max: Joi.number().integer().optional(), 
    is_salary_visible: Joi.boolean().optional(),
    status: Joi.string().valid('open', 'closed').optional()
  }),

  applyJob: Joi.object({
    user_id: Joi.string().required(),
    job_id: Joi.string().required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending')
  }),

  tokenPayload: Joi.object({
    refreshToken: Joi.string().required()
  })
};

module.exports = { validatePayload, schemas };