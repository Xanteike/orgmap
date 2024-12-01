'use strict';

var utils = require('../utils/writer.js');
var Profile = require('../service/ProfileService');

module.exports.apiProfileIdDELETE = function apiProfileIdDELETE (req, res, next, id, username) {
  Profile.apiProfileIdDELETE(id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiProfileIdGET = function apiProfileIdGET (req, res, next, id, username) {
  Profile.apiProfileIdGET(id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiProfileIdPUT = function apiProfileIdPUT (req, res, next, body, id, username) {
  Profile.apiProfileIdPUT(body, id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
