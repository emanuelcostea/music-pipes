var Joi = require('joi');

exports = Joi.object({
    id: Joi.number().integer().greater(0).required(),
    content: Joi.binary().required(),
    name: Joi.string().max(250).required(),
    description: Joi.string(),
    created_at: Joi.date().timestamp('unix').required(),
    updated_at: Joi.date().timestamp('unix').required()
});