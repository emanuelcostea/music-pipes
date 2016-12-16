exports.register = function (server, options, next) {

    server.route({
        path: '/alive',
        method: 'GET',
        handler: function (request, reply) {
            reply('I\'m alive!');
        }
    });

    next();

};

exports.register.attributes = {
    pkg: require('./package.json')
};