'use strict';


/**
 * Retrieve authenticated user's ID
 * Returns the username of the authenticated user from the request headers. This endpoint is used to verify the identity of the user making the request.
 *
 * auth String The JWT token for authentication.
 * returns String
 **/
exports.apiIdGET = function(auth) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "existing_user";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

