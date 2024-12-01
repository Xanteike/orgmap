'use strict';

var utils = require('../utils/writer.js');
var Authentication = require('../service/AuthenticationService');

module.exports.authCheckPOST = function authCheckPOST (req, res, next, auth) {
  Authentication.authCheckPOST(auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authLoginPOST = function authLoginPOST (req, res, next, username, password) {
  Authentication.authLoginPOST(username, password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authRefreshPOST = function authRefreshPOST (req, res, next, auth) {
  Authentication.authRefreshPOST(auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authSignupPOST = function authSignupPOST (req, res, next, username, password) {
  Authentication.authSignupPOST(username, password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
