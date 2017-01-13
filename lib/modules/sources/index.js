var Joi = require('joi');
var sourceSchema = require('./source.schema');
var database = require('../../database');


exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/api/sources',
        handler: function (request, reply) {
            return database('sources')
                .select()
                .then((collection) => reply(collection));
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
            return database('sources').insert(request.payload).then((ids) =>
                database('sources').whereIn('id', ids)
                    .then((resources) => reply(resources))
            );
        },
        config: {
            validate: {
                payload: Joi.object({
                    path: Joi.string().max(250).required(),
                    length: Joi.number().integer().required(),
                    description: Joi.string()
                })
            },
            response: {
                schema: Joi.array().items(sourceSchema)
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sources/{id}',
        handler: function (request, reply) {
            return database('sources').where('id', request.params.id)
                .then((resources) => reply(resources));
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().greater(0)
                }
            },
            response: {
                schema: Joi.array().items(sourceSchema)
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/sources/{id}',
        handler: function (request, reply) {
            return database('sources').where('id', request.params.id)
                .update(request.payload)
                .then((result) => reply(!!result));
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().greater(0)
                },
                payload: Joi.object({
                    path: Joi.string().max(250).required(),
                    length: Joi.number().integer().required(),
                    description: Joi.string()                    
                })
            },
            response: {
                schema: Joi.boolean()
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/api/sources/{id}',
        handler: function (request, reply) {
            return database('sources').where('id', request.params.id)
                .delete()
                .then((result) => reply(!!result));
        },
        config: {
            validate: {
                 params: {
                    id: Joi.number().integer().greater(0)
                }             
            },
            response: {
                schema: Joi.boolean()
            }
        }
    });  

    next();

};

exports.register.attributes = {
    pkg: require('./package.json')
};