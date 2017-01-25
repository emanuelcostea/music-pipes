const co = require('co');
const Joi = require('joi');
const Boom = require('boom');
const JWT   = require('jsonwebtoken');
const hapiJWT = require('hapi-auth-jwt2');

const database = require('../../database');

const JWT_SECRET_KEY = 'mdBkHltlKw6FQAdqSPoENgMEln3RLw3nvmxGUW7TbiMA8pw9puEh+ar+1CStjp9ELTHQaqkQE5awcg==';
const RANDOM_ANIMAL_NAMES = ['alligator', 'anteater', 'armadillo', 'auroch', 'axolotl', 'badger', 'bat', 'beaver', 'buffalo', 'camel', 'chameleon', 'cheetah', 'chipmunk', 'chinchilla', 'chupacabra', 'cormorant', 'coyote', 'crow', 'dingo', 'dinosaur', 'dolphin', 'duck', 'elephant', 'ferret', 'fox', 'frog', 'giraffe', 'gopher', 'grizzly', 'hedgehog', 'hippo', 'hyena', 'jackal', 'ibex', 'ifrit', 'iguana', 'koala', 'kraken', 'lemur', 'leopard', 'liger', 'llama', 'manatee', 'mink', 'monkey', 'narwhal', 'nyan cat', 'orangutan', 'otter', 'panda', 'penguin', 'platypus', 'python', 'pumpkin', 'quagga', 'rabbit', 'raccoon', 'rhino', 'sheep', 'shrew', 'skunk', 'slow loris', 'squirrel', 'turtle', 'walrus', 'wolf', 'wolverine', 'wombat'];

exports.register = function (server, options, next) {

    server.register(hapiJWT);

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET_KEY,
        validateFunc: co.wrap(function* (session_id, request, callback) {
            var sessionData = yield database('sessions').select().where('id', session_id);
            if (!sessionData.length 
                || (!sessionData[0].connected && request.route.path !== '/nes/auth')
                || (sessionData[0].expire < Math.floor(Date.now() / 1000))) {
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
                    room_id: (request.payload || {}).room_id ? +request.payload.room_id : defaultRoom[0].id
                }

                var session_id;
                if (request.headers.authorization) {
                    var session_result = yield database('sessions')
                        .select('id', 'name')
                        .where('id', parseInt(JWT.verify(request.headers.authorization, JWT_SECRET_KEY), 10));
                    if (session_result.length) {
                        session_id = session_result[0].id;
                        sessionData.name = session_result[0].name;
                    }
                }

                if (session_id) {
                    yield database('sessions').where('id', session_id).update(sessionData);  
                    sessionData.token = request.headers.authorization;
                } else {
                    sessionData.name = 'anonymous ' + RANDOM_ANIMAL_NAMES[Math.floor(Math.random() * RANDOM_ANIMAL_NAMES.length)];
                    session_id = yield database('sessions').insert(sessionData);
                    session_id = session_id[0];
                    sessionData.token = JWT.sign(session_id, JWT_SECRET_KEY);
                }
                sessionData.id = session_id;
 
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
                    id: Joi.number(),
                    name: Joi.string(),
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
