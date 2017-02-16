/**
 * This file is executable by jenkins and can receive parameters to 
 * 
 * Params:
 * 0 - action [get/create/remote/destroy]
 * 1 - provider [azure-v2/amazon/...]
 * 2 - config: a string representing json with all config settings. see config.sample.json
 * 3 - option: passing options to remote and destroy
 */
var actions = require('./lib');

if (!process.argv || process.argv.length < 5) {
  return console.error('Not enough parameters were sent');
}

var node = process.argv[0];
var exec = process.argv[1];
var action = process.argv[2];
var provider = process.argv[3];

var configString = process.argv[4];
var config = JSON.parse(configString);
var providerConfig = config[provider];

var optionsString = process.argv.length > 5 ? process.argv[5] : '{}';
var options = JSON.parse(optionsString);

switch (action) {
  case 'create':

    var createVMClient = new actions.CreateVMAction(providerConfig.connection);
    createVMClient.perform(providerConfig.server, function (err, server) {
      if (err) {
        return console.error(err);
      }
      console.dir(server);
    });    
    break;

  case 'get':
    var createVMClient = new actions.CreateVMAction(providerConfig.connection);
    createVMClient.perform(providerConfig.server, function (err, server) {
      if (err) {
        return console.error(err);
      }
      console.dir(server);
    });    
    break;

  case 'remote':
    var remoteExecute = new actions.RemoteExecute(providerConfig.connection);
    remoteExecute.perform(providerConfig.server, options, function (err, outputs) {
      if (err) {
        return console.error(err);
      }
    });    
    break;

  case 'destroy':
    var destroyVMClient = new actions.DestroyVMAction(providerConfig.connection);

    destroyVMClient.perform(providerConfig.server, options, function (err, server) {
      if (err) {
        return console.error(err);
      }
      console.dir(server);
    });        
    break;

  default:
    return console.error('Action ' + action + ' was not recognized');
}