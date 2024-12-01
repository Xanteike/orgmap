'use strict';

var utils = require('../utils/writer.js');
var Graph = require('../service/GraphService');

module.exports.apiGraphGET = function apiGraphGET (req, res, next, user, team, department) {
  Graph.apiGraphGET(user, team, department)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiGraphPOST = function apiGraphPOST (req, res, next, body, username) {
  Graph.apiGraphPOST(body, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
