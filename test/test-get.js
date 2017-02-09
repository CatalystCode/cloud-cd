var path = require('path');
var actions = require('../lib');
var config = require('./config');

var remoteExecute = new actions.RemoteExecute(config.azure.connection);

// Windows sample
var ps_script = path.join(__dirname, '..', 'src', 'actions', 'remote-execute', 'powershell', 'dummy.ps1');
remoteExecute.perform(config.azure.server2, { script: ps_script }, (err, outputs) => {
  if (err) {
    return console.error(err);
  }
});

// Linux sample
// var ssh_script = path.join(__dirname, '..', 'src', 'actions', 'remote-execute', 'ssh', 'deploy_base.sh');
// remoteExecute.perform(config.azure.server, { script: ssh_script }, (err, outputs) => {
//   if (err) {
//     return console.error(err);
//   }
// });