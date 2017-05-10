"use strict";
var ssh = require("./ssh");
var get_vm_1 = require("../get-vm");
var RemoteExecute = (function () {
    function RemoteExecute(clientOptions) {
        this.getVMClient = new get_vm_1.GetVMAction(clientOptions);
    }
    RemoteExecute.prototype.perform = function (config, scriptConfig, callback) {
        try {
            this.validateOptions(config, scriptConfig);
            this.getVMClient.perform(config, function (error, server) {
                if (error) {
                    return callback(error);
                }
                var osType = server &&
                    server.original &&
                    server.original.storageProfile &&
                    server.original.storageProfile.osDisk &&
                    server.original.storageProfile.osDisk.osType || null;
                ssh.execute({
                    guest_ip: server.hostname,
                    guest_user: config.username,
                    guest_password: config.password,
                    script: scriptConfig.script,
                    args: scriptConfig.args
                }, osType, callback);
                ;
            });
        }
        catch (e) {
            return callback(e);
        }
    };
    RemoteExecute.prototype.validateOptions = function (config, scriptConfig) {
        if (!scriptConfig.script) {
            throw new Error('No scripts were supplied in the configuration to execute');
        }
        return true;
    };
    return RemoteExecute;
}());
exports.RemoteExecute = RemoteExecute;
//# sourceMappingURL=index.js.map