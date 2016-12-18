var Joi = require('joi');
var sourceSchema = require('./source.schema');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/api/sources',
        handler: function (request, reply) {
            reply('Hello!');
        },
        config: {
            response: {
                schema: Joi.array().items(sourceSchema)
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/sources',
        handler: function (request, reply) {
            reply('Hello!');
        },
        config: {
            validate: {
                payload: Joi.object({
                    content: Joi.binary().required(),
                    name: Joi.string().max(250).required(),
                    description: Joi.string()
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sources/{id}',
        handler: function (request, reply) {
            reply('Hello!');
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().greater(0)
                }
            },
            response: {
                schema: sourceSchema
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/sources/{id}',
        handler: function (request, reply) {
            reply('Hello!');
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().greater(0)
                },
                payload: Joi.object({
                    content: Joi.binary(),
                    name: Joi.string().max(250),
                    description: Joi.string()                    
                })
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/api/sources/{id}',
        handler: function (request, reply) {
            reply('Hello!');
        },
        config: {
            validate: {
                 params: {
                    id: Joi.number().integer().greater(0)
                }               
            }
        }
    });  

    next();

};

exports.register.attributes = {
    pkg: require('./package.json')
};