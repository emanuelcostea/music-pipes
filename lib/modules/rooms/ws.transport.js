const Nes = require('nes');

module.exports = function (server, options) {

    server.register(Nes, function (err) {
        server.route({
            method: 'GET',
            path: '/h',
            config: {
                id: 'hello',
                handler: function (request, reply) {
                    return reply('world!');
                }
            }
        });
    });

};