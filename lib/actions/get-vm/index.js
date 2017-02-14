"use strict";
var pkgcloud = require('pkgcloud-with-arm');
var GetVMAction = (function () {
    function GetVMAction(clientOptions) {
        this.client = pkgcloud.compute.createClient(clientOptions);
    }
    GetVMAction.prototype.perform = function (options, callback) {
        this.validateOptions(options);
        this.client.getServer(options.name, callback);
    };
    GetVMAction.prototype.validateOptions = function (options) {
        if (!options) {
            throw new Error('No options were sent');
        }
        if (!options.name) {
            throw new Error('No name options was sent');
        }
    };
    return GetVMAction;
}());
exports.GetVMAction = GetVMAction;
//# sourceMappingURL=index.js.map