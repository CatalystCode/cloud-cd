var path = require('path');
var actions = require('../lib');
var config = require('./config');

var remoteExecute = new actions.RemoteExecute(config.azure.connection);

// Windows sample
var ps_script = path.join(__dirname, '..', 'src', 'actions', 'remote-execute', 'powershell', 'dummy.ps1');
remoteExecute.perform(config.azure.server_windows, {
  script: ps_script,
  args: 'bla'
}, (err, outputs) => {
  if (err) {
    return console.error(err);
  }
});

//Linux sample
// var ssh_script = path.join(__dirname, '..', 'src', 'actions', 'remote-execute', 'ssh', 'demo.sh');
// remoteExecute.perform(config.azure.server_linux, {
//   script: ssh_script,
//   args: 'bla'
// }, (err, outputs) => {
//   if (err) {
//     return console.error(err);
//   }
// });