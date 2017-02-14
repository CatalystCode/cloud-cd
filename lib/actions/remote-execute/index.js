"use strict";
var ssh = require("./ssh");
var powershell_1 = require("./powershell");
var get_vm_1 = require("../get-vm");
var RemoteExecute = (function () {
    function RemoteExecute(clientOptions) {
        this.getVMClient = new get_vm_1.GetVMAction(clientOptions);
    }
    RemoteExecute.prototype.perform = function (config, scriptConfig, callback) {
        var _this = this;
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
                switch (osType) {
                    case 'Windows':
                        _this.win_client = new powershell_1.ExecuteRemotePowerShell();
                        _this.win_client.run_powershell(server.hostname, config.username, config.password, scriptConfig.script, callback);
                        break;
                    case 'Linux':
                        ssh.execute({
                            guest_ip: server.hostname,
                            guest_user: config.username,
                            guest_password: config.password,
                            script: scriptConfig.script
                        }, callback);
                        break;
                    default:
                        return callback(new Error("os type was not found: [" + osType + "]"));
                }
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