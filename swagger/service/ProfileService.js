'use strict';


/**
 * Delete a user profile by ID
 * Deletes the user profile associated with the specified ID. The requester must have permission to manage the profile.
 *
 * id String ID of the user profile.
 * username String Username of the requester.
 * no response value expected for this operation
 **/
exports.apiProfileIdDELETE = function(id,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a user profile by ID
 * Retrieves the user profile associated with the specified ID. The response includes information about whether the requester has permission to manage the profile.
 *
 * id String ID of the user profile.
 * username String Username of the requester.
 * returns inline_response_200_3
 **/
exports.apiProfileIdGET = function(id,username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "allowedToManage" : true,
  "name" : "John Doe",
  "id" : "12345",
  "email" : "john.doe@example.com"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update a user profile by ID
 * Updates the user profile associated with the specified ID. The requester must have permission to manage the profile.
 *
 * body Profile_id_body 
 * id String ID of the user profile.
 * username String Username of the requester.
 * no response value expected for this operation
 **/
exports.apiProfileIdPUT = function(body,id,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

