'use strict';

var utils = require('../utils/writer.js');
var Department = require('../service/DepartmentService');

module.exports.apiDepartmentIdDELETE = function apiDepartmentIdDELETE (req, res, next, id, username) {
  Department.apiDepartmentIdDELETE(id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiDepartmentIdGET = function apiDepartmentIdGET (req, res, next, id, username) {
  Department.apiDepartmentIdGET(id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiDepartmentIdPUT = function apiDepartmentIdPUT (req, res, next, body, id, username) {
  Department.apiDepartmentIdPUT(body, id, username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
