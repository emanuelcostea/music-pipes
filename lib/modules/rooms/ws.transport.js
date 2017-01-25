const co = require('co');

const database = require('../../database');

module.exports = function (server, options) {

    /**
     * TODO:
     * - Filter users subscription message by user id
     * - [DONE] update field sessions.connected when web socket is connected
     * - [DONE] don't allow any requests with sessions.connected = false
     * CRONJOB specifications:
     * - check active sockets on websockets
     *  - if expire time is invalid then disconnect socket and remove session from database
     * - remove all the invalid sessions from database
     * - remove all rooms with 0 connected users
     */
    // var filterUsers = function (path, message, options, next) {
    //     //return next(message.updater !== options.credentials.username);    
    //     return next(true);
    // }
    
    // var markConnection = function(userId, status) {
    //     console.log(userId, status);
    //     return database('sessions')
    //         .where('id', userId)
    //         .update('connected', status);
    // };

    // var inRoom = co.wrap(function*(socket, path, params, next) {
    //     try {            
    //         var onlineIDs = [];
    //         server.eachSocket((socket) => 
    //             onlineIDs.push(socket.auth.credentials), path);
    //         var sessions = yield database('sessions')
    //             .select('id', 'expire', 'created_at')
    //             .whereIn('id', onlineIDs);
    //         console.log(path);
    //         server.publish(path + '/status', sessions);

    //         return next();
    //     } catch(e) {
    //         return next(e);
    //     }
    // });

    // server.subscription('/room/{id}/status', {
    //     filter: filterUsers,
    //     auth: {
    //         mode: 'required'
    //     }
    // });

    // server.subscription('/room/{id}', {
    //     filter: filterUsers,
    //     auth: {
    //         mode: 'required'
    //     },
    //     onSubscribe: inRoom,
    //     onUnsubscribe: inRoom
    // });

};