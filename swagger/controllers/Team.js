'use strict';

var utils = require('../utils/writer.js');
var Team = require('../service/TeamService');

module.exports.apiTeamIdDELETE = function apiTeamIdDELETE (req, res, next, id, username) {
  Team.apiTeamIdDELETE(id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiTeamIdGET = function apiTeamIdGET (req, res, next, id, username) {
  Team.apiTeamIdGET(id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiTeamIdPUT = function apiTeamIdPUT (req, res, next, body, id, username) {
  Team.apiTeamIdPUT(body, id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
