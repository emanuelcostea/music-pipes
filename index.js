'use strict';

const Hapi = require('hapi');
const Glue = require('glue');

const manifest = require('./config/manifest.json');
const options = {
    relativeTo: __dirname + '/lib/modules'
};
const server = new Hapi.Server();

Glue.compose(manifest, options, function (err, server) {
    server.start(function (err) {
        if (err) {
            throw err;
        }
    });
});