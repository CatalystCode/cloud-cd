var path = require('path');
var actions = require('../lib');
var config = require('./config');

var remoteExecute = new actions.RemoteExecute(config.azure.connection);

remoteExecute.perform(config.azure.server2, { 
  script: path.join(__dirname, '..', 'lib', 'actions', 'remote-execute', 'powershell', 'dummy.ps1') 
}, (err, server) => {
  if (err) {
    return console.error(err);
  }
  
  //remoteExecute.perform(config.azure.server, )

});