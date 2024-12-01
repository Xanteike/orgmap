'use strict';


/**
 * Retrieve a recursive graph of connections
 *
 * user String The username to start the graph from (optional)
 * team String The team ID to start the graph from (optional)
 * department String The department ID to start the graph from (optional)
 * returns List
 **/
exports.apiGraphGET = function(user,team,department) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ { }, { } ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Set the starting point for the graph
 *
 * body Api_graph_body 
 * username String Username of the requester
 * no response value expected for this operation
 **/
exports.apiGraphPOST = function(body,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

