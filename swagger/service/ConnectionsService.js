'use strict';


/**
 * Connect users, teams, or departments
 * Connects users, teams, or departments based on the provided roles. This endpoint allows for the management of relationships between different entities within the system.
 *
 * body Api_connect_body 
 * auth String The JWT token for authentication. Must be a valid token.
 * returns inline_response_200_1
 **/
exports.apiConnectPOST = function(body,auth) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "Connections established successfully."
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Disconnect users, teams, or departments
 * Disconnects users, teams, or departments based on the provided roles. This endpoint allows for the management of relationships between different entities within the system by removing existing connections. The request must specify exactly two entities to disconnect.
 *
 * body Api_disconnect_body 
 * auth String The JWT token for authentication. Must be a valid token.
 * returns inline_response_200_2
 **/
exports.apiDisconnectPOST = function(body,auth) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "Disconnections established successfully."
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

