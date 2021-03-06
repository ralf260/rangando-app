"use strict";
exports.__esModule = true;
var jsonServer = require("json-server");
var fs = require("fs");
var https = require("https");
var auth_1 = require("./auth");
var server = jsonServer.create();
var router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// Add custom routes before JSON Server router
server.use('/echo', function (req, res) {
    res.jsonp(req.query);
});
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
//middle para login
server.post('/login', auth_1.handleAuthentication);
server.use(function (req, res, next) {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});
// Use default router
server.use(router);
var options = {
    cert: fs.readFileSync('./backend/keys/cert.pem'),
    key: fs.readFileSync('./backend/keys/key.pem')
};
https.createServer(options, server).listen(3001, function () {
    console.log('Ativando JSON server porta 3001.');
});
