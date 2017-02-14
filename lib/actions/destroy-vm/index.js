"use strict";
var async = require("async");
var pkgcloud = require('pkgcloud-with-arm');
var DestroyVMAction = (function () {
    function DestroyVMAction(clientOptions) {
        this.client = pkgcloud.compute.createClient(clientOptions);
        this.storageClient = pkgcloud.storage.createClient(clientOptions);
    }
    DestroyVMAction.prototype.perform = function (server, options, callback) {
        this.validateOptions(server, options);
        var self = this;
        this.client.destroyServer(server, options, function (error, serverDetails) {
            if (error) {
                return callback(error, serverDetails);
            }
            if (options.destroyStorage || (!options.destroyFileOSDisk && !options.destroyFileDataDisk)) {
                return callback(null, serverDetails);
            }
            if (self.client.provider === 'azure-v2') {
                var filesToDelete = [];
                if (options.destroyFileDataDisk) {
                    var dataDisks = serverDetails &&
                        serverDetails.azure &&
                        serverDetails.azure.storageProfile &&
                        serverDetails.azure.storageProfile.dataDisks || [];
                    for (var i in dataDisks) {
                        if (dataDisks[i].vhd.uri) {
                            filesToDelete.push(dataDisks[i].vhd.uri);
                        }
                    }
                }
                if (options.destroyFileOSDisk) {
                    var storageUri = serverDetails &&
                        serverDetails.azure &&
                        serverDetails.azure.storageProfile &&
                        serverDetails.azure.storageProfile.osDisk &&
                        serverDetails.azure.storageProfile.osDisk.vhd &&
                        serverDetails.azure.storageProfile.osDisk.vhd.uri || null;
                    if (storageUri) {
                        filesToDelete.push(storageUri);
                    }
                }
                // Deleting files
                async.forEachSeries(filesToDelete, function (file, cb) {
                    var uriPath = file.substring(file.indexOf('://') + 3);
                    var storageAccountName = uriPath.split('.')[0];
                    var containerName = uriPath.split('/')[1];
                    var filePath = uriPath.substring(uriPath.indexOf('/') + 1);
                    filePath = filePath.substring(filePath.indexOf('/') + 1);
                    self.storageClient.removeFile(storageAccountName, filePath, { storage: { container: containerName } }, cb);
                }, function (error) {
                    return callback(error, serverDetails);
                });
            }
            else {
                return callback(null, serverDetails);
            }
        });
    };
    DestroyVMAction.prototype.validateOptions = function (server, options) {
        if (!server) {
            throw new Error('No server wes sent to destroy');
        }
    };
    return DestroyVMAction;
}());
exports.DestroyVMAction = DestroyVMAction;
//# sourceMappingURL=index.js.map