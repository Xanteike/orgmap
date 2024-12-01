'use strict';


/**
 * Delete a team by ID
 *
 * id String ID of the team
 * username String Username of the requester
 * no response value expected for this operation
 **/
exports.apiTeamIdDELETE = function(id,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a team by ID
 *
 * id String ID of the team
 * username String Username of the requester
 * returns Object
 **/
exports.apiTeamIdGET = function(id,username) {
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
 * Update a team by ID
 *
 * body Object 
 * id String ID of the team
 * username String Username of the requester
 * no response value expected for this operation
 **/
exports.apiTeamIdPUT = function(body,id,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

