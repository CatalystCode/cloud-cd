"use strict";
var child_process_1 = require("child_process");
var util = require("util");
var ExecuteRemotePowerShell = (function () {
    function ExecuteRemotePowerShell() {
        this.ps_child = null;
    }
    /**
     * @description
     *  run powerhsell script localy. the script will invoke a remote command using winrm.
     *  The remote VM must have winrm enbled https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-winrm-windows
     * @example
     *  run_powershell("52.178.176.53", "username", "Pa$$word1", path.join(__dirname, "dummy.ps1"), (output) {
     *     console.log(output);
     *  });
     */
    ExecuteRemotePowerShell.prototype.run_powershell = function (host, username, password, script, callback) {
        var command = util.format('%s', "assets//InvokeRemotePS -host ", host, " -username ", username, " -password ", password, " -scriptpath ", script);
        this.ps_child = child_process_1.spawn("powershell.exe", [command]);
        var output;
        this.ps_child.stdout.on("data", function (output) {
            console.log("Powershell Data: " + output);
        });
        this.ps_child.stderr.on("data", function (data) {
            console.log("Powershell Errors: " + data);
            callback(new Error(data));
        });
        this.ps_child.on("exit", function () {
            console.log("Powershell Script finished");
        });
        this.ps_child.stdin.end(); //end input          
    };
    return ExecuteRemotePowerShell;
}());
exports.ExecuteRemotePowerShell = ExecuteRemotePowerShell;
//# sourceMappingURL=index.js.map