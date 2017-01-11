"use strict";
var pkgcloud = require('pkgcloud');
var DestroyVMAction = (function () {
    function DestroyVMAction(clientOptions) {
        this.client = pkgcloud.compute.createClient(clientOptions);
    }
    DestroyVMAction.prototype.perform = function (server, options, callback) {
        this.validateOptions(server, options);
        this.client.destroyServer(server, options, callback);
    };
    DestroyVMAction.prototype.validateOptions = function (server, options) {
        if (!server) {
            throw new Error('No server wes sent to destroy');
        }
    };
    return DestroyVMAction;
}());
exports.DestroyVMAction = DestroyVMAction;
//# sourceMappingURL=destroy-vm.js.map