'use strict';


/**
 * Delete a department by ID
 *
 * id String ID of the department
 * username String Username of the requester
 * no response value expected for this operation
 **/
exports.apiDepartmentIdDELETE = function(id,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a department by ID
 *
 * id String ID of the department
 * username String Username of the requester
 * returns Object
 **/
exports.apiDepartmentIdGET = function(id,username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = { };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update a department by ID
 *
 * body Object 
 * id String ID of the department
 * username String Username of the requester
 * no response value expected for this operation
 **/
exports.apiDepartmentIdPUT = function(body,id,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

