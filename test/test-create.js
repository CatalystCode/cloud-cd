var actions = require('../lib');
var config = require('./config');

var createVMClient = new actions.CreateVMAction(config.azure.connection);

createVMClient.perform(config.azure.server_windows, (err, server) => {
  if (err) {
    return console.error(err);
  }
  console.dir(server);
});