'use strict';

var utils = require('../utils/writer.js');
var Connections = require('../service/ConnectionsService');

module.exports.apiConnectPOST = function apiConnectPOST (req, res, next, body, auth) {
  Connections.apiConnectPOST(body, auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiDisconnectPOST = function apiDisconnectPOST (req, res, next, body, auth) {
  Connections.apiDisconnectPOST(body, auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
