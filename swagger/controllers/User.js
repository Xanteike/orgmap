'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.apiIdGET = function apiIdGET (req, res, next, auth) {
  User.apiIdGET(auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
