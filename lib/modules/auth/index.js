const co = require('co');
const Joi = require('joi');
const Boom = require('boom');
const JWT   = require('jsonwebtoken');
const hapiJWT = require('hapi-auth-jwt2');

const database = require('../../database');

const JWT_SECRET_KEY = 'mdBkHltlKw6FQAdqSPoENgMEln3RLw3nvmxGUW7TbiMA8pw9puEh+ar+1CStjp9ELTHQaqkQE5awcg==';

exports.register = function (server, options, next) {

    server.register(hapiJWT);

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET_KEY,
        validateFunc: co.wrap(function* (session_id, request, callback) {
            var sessionData = yield database('sessions').select().where('id', session_id);
            if (!sessionData.length || sessionData[0].expire < Math.floor(Date.now() / 1000)) {
                return callback(null, false);    
            }
            return callback(null, true);
        }),
        verifyOptions: { 
            algorithms: ['HS256'],
            ignoreExpiration: true
        },
        urlKey: false,
        cookieKey: false
    });

    server.auth.default('jwt');

    server.route({
        method: 'POST',
        path: '/api/auth/assign',
        handler: co.wrap(function* (request, reply) {
            try {
                var defaultRoom = yield database('rooms').where('default', true);
                if (!defaultRoom.length) {
                    return reply(Boom.badData('Missing default room'));
                }
                
                var sessionData = {
                    user_agent: request.headers['user-agent'],
                    expire: Math.floor((Date.now() + 30 * 60 * 1000) / 1000), // expires in 30 minutes time
                    room_id: request.payload && request.payload['room_id'] ? +request.payload['room_id'] : defaultRoom[0].id
                }

                var session_id;
                if (request.headers.authorization) {
                    var token = request.headers.authorization;
                    session_id = parseInt(JWT.verify(token, JWT_SECRET_KEY), 10); 
                    yield database('sessions').where('id', session_id).update(sessionData);  
                    sessionData.token = token;          
                } else {
                    session_id = yield database('sessions').insert(sessionData);
                    sessionData.token = JWT.sign(session_id[0], JWT_SECRET_KEY);
                }
                
                return reply(sessionData).header("Authorization", sessionData.token);
            } catch (e) {
                return reply(e);
            }
        }),
        config: {
            auth: false,
            validate: {
                payload: Joi.object({
                    room_id: Joi.number().integer()
                }).allow(null)
            },
            response: {
                schema: Joi.object({
                    user_agent: Joi.string(),
                    expire: Joi.number(),
                    room_id: Joi.number(),
                    token: Joi.string()
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/auth/credentials',
        handler: function (request, reply) {
            reply({
                _id: request.auth.credentials
            });
        },
        config: {
            response: {
                schema: Joi.object({
                    _id: Joi.string().required(),
                })
            }
        }
    });

    next();

};

exports.register.attributes = {
    pkg: require('./package.json')
};
