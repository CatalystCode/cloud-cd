# cloud-cd
This module abstracts the process of continuous delivery on multiple clouds.

# Resources

- `pkgcloud`: This module uses [pkgcloud](https://github.com/pkgcloud/pkgcloud) for creating and managing resources on different clouds.

# Known Issues
This package currently uses [CatalystCode/pkgcloud](https://github.com/CatalystCode/pkgcloud) directly to enable azure ARM.
Once the [pull request](https://github.com/pkgcloud/pkgcloud/pull/550) is merged, the relevant dependency should also be updated.

Currently supports Windows Server 2012 and up for running remote commands (using SSH).

# Usage

1. [Create a service principal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal)
2. Create a resource group in azure (i.e. "resources-rg")
3. Create the following config (edit to match your account's info):

```js

// This is an example of the values you need to insert (it will not work as is)
// Make sure to update all values with your relevant data
var config = {
  azure: {
    connection: {
      provider: 'azure-v2',
      subscriptionId: "e9be1fc6-cb43-4830-99f9-0251055fecec",
      resourceGroup: "resources-rg",

      servicePrincipal: {
        clientId: "2285862c-d875-45f2-a53a-57d7a5b76606",
        secret: "FIUH34R98HSsdfHF9438swoieFNcij3SffsSf45nJFl=",
        domain: "06f306c4-bc72-4ad4-99ac-a6b5f4b56cc9"
      }
    },
    server: {
      name:  'vm-name',
      flavor: 'Standard_D1',
      username:  'cloudcdusr',
      password:  'Cloudcdusr!!',

      storageOSDiskName: "osdisk",
      storageDataDiskNames: [ "datadisk1" ],

      osType: 'Linux',
      imagePublisher: "Canonical",
      imageOffer: "UbuntuServer",
      imageSku: "16.04.0-LTS",
      imageVersion: "latest"
    }
  }
}
```

4. Execute the following command:

```js
var cloudCD = require('cloud-cd');

var getVMClient = new cloudCD.GetVMAction(config.azure.connection);
getVMClient.perform(config.azure.server, (err, server) => {
  if (err) {
    return console.error(err);
  }
  console.dir(server);
});

var createVMClient = new cloudCD.CreateVMAction(config.azure.connection);
createVMClient.perform(config.azure.server, (err, server) => {
  if (err) {
    return console.error(err);
  }
  console.dir(server);
});

var remoteExecuteClient = new cloudCD.RemoteExecute(config.azure.connection);
// Windows remote execute sample
var ps_script = path.join(__dirname, 'scripts', 'dummy.ps1');
remoteExecuteClient.perform(config.azure.server2, { script: ps_script }, (err, outputs) => {
  if (err) {
    return console.error(err);
  }
});

// Linux remote execute sample
var ssh_script = path.join(__dirname, 'scripts', 'demo.sh');
remoteExecuteClient.perform(config.azure.server, { script: ssh_script }, (err, outputs) => {
  if (err) {
    return console.error(err);
  }
});

var destroyVMClient = new cloudCD.DestroyVMAction(config.azure.connection);
destroyVMClient.perform(config.azure.server, (err) => {
  if (err) {
    return console.error(err);
  }
});
```

# License
MIT