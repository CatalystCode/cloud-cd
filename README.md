# cloud-cd
This module abstracts the process of continuous delivery on multiple clouds.

# Resources

- `pkgcloud`: This module uses [pkgcloud](https://github.com/pkgcloud/pkgcloud) for creating and managing resources on different clouds.

# Known Issues
This package currently uses [CatalystCode/pkgcloud](https://github.com/CatalystCode/pkgcloud) directly to enable azure ARM.
Once the [pull request](https://github.com/pkgcloud/pkgcloud/pull/550) is merged, the relecant dependency should also be updated.

# Executing a remote script on a Windows machine
To execute a remote script on a windows you machine you need to deploy it with the following script:
https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-winrm-windows