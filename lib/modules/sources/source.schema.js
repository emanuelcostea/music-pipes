var Joi = require('joi');

module.exports = Joi.object({
    id: Joi.number().integer().greater(0).required(),
    name: Joi.string().max(250).required(),
    path: Joi.string().max(250).required(),
    length: Joi.number().integer().required(),
    description: Joi.string(),
    created_at: Joi.date().timestamp('unix').required(),
    updated_at: Joi.date().timestamp('unix').required()
});