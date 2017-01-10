const Joi = require('joi');
const JWT   = require('jsonwebtoken');
const hapiJWT = require('hapi-auth-jwt2');

const JWT_SECRET_KEY = 'mdBkHltlKw6FQAdqSPoENgMEln3RLw3nvmxGUW7TbiMA8pw9puEh+ar+1CStjp9ELTHQaqkQE5awcg==';

exports.register = function (server, options, next) {

    server.register(hapiJWT);

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET_KEY,
        validateFunc: (decodedId, request, callback) => {
            request.server.app.nedb.session.findOne({ _id: decodedId }, (err, doc) => {
                if (err || doc === null || doc.expire < (new Date()).getTime()) {
                    if (doc && doc._id !== undefined) {
                        request.server.app.nedb.session.remove({ _id: doc._id });
                    }
                    return callback(null, false);
                }
                return callback(null, true);
            });
        },
        verifyOptions: { 
            algorithms: ['HS256'],
            ignoreExpiration: true
        },
        urlKey: false,
        headerKey: false,
        cookieKey: 'token'
    });

    server.auth.default('jwt');

    server.route({
        method: 'POST',
        path: '/api/auth/assign',
        handler: function (request, reply) {
            var session = {
                userAgent: request.headers['user-agent'],
                expire: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
            }
            
            request.server.app.nedb.session.insert(session, (err, doc) => {
                if (err) {
                    return reply(err);
                }
                const token = JWT.sign(doc._id, JWT_SECRET_KEY);
                reply(true).state("token", token, {
                    ttl: 365 * 24 * 60 * 60 * 1000,
                    encoding: 'none',
                    isSecure: false,
                    clearInvalid: false,
                    strictHeader: true,
                    path: '/'
                });
            });
        },
        config: {
            auth: false,
            response: {
                schema: Joi.boolean()
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
