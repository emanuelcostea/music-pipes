const Joi = require('joi');
const hapiJWT = require('hapi-auth-jwt2');

exports.register = function (server, options, next) {
    var online = [];

    server.register(hapiJWT);
    server.auth.strategy('jwt', 'jwt', {
        key: 'wow',
        validateFunc: (decoded, request, callback) => {
            callback(null, true);
        },
        verifyOptions: { 
            algorithms: ['HS256'] 
        }
    });
    server.auth.default('jwt');

    server.route({
        method: 'POST',
        path: '/api/auth/validate',
        handler: function (request, reply) {
            var token = // Create and return token
        },
        config: {
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