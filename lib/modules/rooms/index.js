const Joi = require('joi'),
    roomSchema = require('./room.schema'),
    database = require('../../database'),
    wsTransport = require('./ws.transport');

exports.register = function (server, options, next) {

    wsTransport(server, options);

    server.route({
        method: 'GET',
        path: '/api/rooms',
        handler: function (request, reply) {
            return database('rooms')
                .select()
                .then((collection) => reply(collection));
        },
        config: {
            response: {
                schema: Joi.array().items(roomSchema)
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/rooms',
        handler: function (request, reply) {
            return database('rooms').insert(request.payload).then((ids) =>
                database('rooms').whereIn('id', ids)
                    .then((resources) => reply(resources))
            );
        },
        config: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().max(250).required(),
                    default: Joi.boolean()
                })
            },
            response: {
                schema: Joi.array().items(roomSchema)
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/rooms/{id}',
        handler: function (request, reply) {
            return database('rooms').where('id', request.params.id)
                .then((resources) => reply(resources));
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().greater(0)
                }
            },
            response: {
                schema: Joi.array().items(roomSchema)
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/rooms/{id}',
        handler: function (request, reply) {
            return database('rooms').where('id', request.params.id)
                .update(request.payload)
                .then((result) => reply(!!result));
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().greater(0)
                },
                payload: Joi.object({
                    name: Joi.string().max(250),
                    default: Joi.boolean()            
                })
            },
            response: {
                schema: Joi.boolean()
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/api/rooms/{id}',
        handler: function (request, reply) {
            return database('rooms').where('id', request.params.id)
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