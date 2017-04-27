var actions = require('../lib');
var config = require('./config');

var destroyVMClient = new actions.DestroyVMAction(config.azure.connection);

destroyVMClient.perform(config.azure.server_linux, {
  destroyNics: true,
  destroyPublicIP: true,
  destroyVnet: true,
  destroyStorage: false,
  destroyFileOSDisk: true,
  destroyFileDataDisk: true
}, (err, server) => {
  if (err) {
    return console.error(err);
  }
  console.dir(server);
});