"use strict";
var pkgcloud = require('pkgcloud');
var CreateVMAction = (function () {
    function CreateVMAction(clientOptions) {
        this.client = pkgcloud.compute.createClient(clientOptions);
    }
    CreateVMAction.prototype.perform = function (options, callback) {
        this.validateOptions(options);
        this.client.createServer(options, callback);
    };
    CreateVMAction.prototype.validateOptions = function (options) {
        if (!options) {
            throw new Error('No options were sent');
        }
        if (!options.name) {
            throw new Error('No name options was sent');
        }
        if (!options.username || !options.password) {
            throw new Error('No username or password were supplied');
        }
        if (!options.flavor) {
            throw new Error('Please provide a flavor for the created VM');
        }
    };
    return CreateVMAction;
}());
exports.CreateVMAction = CreateVMAction;
//# sourceMappingURL=index.js.map