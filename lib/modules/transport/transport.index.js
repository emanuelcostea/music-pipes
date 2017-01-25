const co = require('co');
const Nes = require('nes');

const database = require('../../database');

exports.register = function (server, options, next) {

    var markConnection = function(userId, status) {
        return database('sessions')
            .where('id', userId)
            .update('connected', status);
    };

    var inRoom = co.wrap(function*(socket, path, params, next) {
        try {            
            var onlineIDs = [];
            server.eachSocket((socket) => 
                onlineIDs.push(socket.auth.credentials), path);
            var sessions = yield database('sessions')
                .select('id', 'name', 'expire', 'created_at')
                .whereIn('id', onlineIDs);

            server.publish(path + '/status', sessions);
            return next();
        } catch(e) {
            return next(e);
        }
    });

    var filterUsers = function (path, message, options, next) {
        //console.log(options.credentials);
        //return next(message.updater !== options.credentials.username);    
        return next(true);
    }

    server.register({
        register: Nes,
        options: {
            onConnection: co.wrap(function*(socket) {
                yield markConnection(socket.auth.credentials, true);
            }),
            onDisconnection: co.wrap(function*(socket) {
                yield markConnection(socket.auth.credentials, false);
            }),
        },
    }, (err) => {
        if (err) {
            throw err;
        }

        server.subscription('/room/{id}/status', {
            auth: {
                mode: 'required'
            }
        });

        server.subscription('/room/{id}', {
            filter: filterUsers,
            auth: {
                mode: 'required'
            },
            onSubscribe: inRoom,
            onUnsubscribe: inRoom
        });
    });

    return next();
}

exports.register.attributes = {
    pkg: require('./package.json')
};