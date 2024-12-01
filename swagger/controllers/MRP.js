'use strict';

var utils = require('../utils/writer.js');
var MRP = require('../service/MRPService');

module.exports.apiMrpGET = function apiMrpGET (req, res, next) {
  MRP.apiMrpGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
