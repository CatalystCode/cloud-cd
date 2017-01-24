// run powerhsell script localy. the script will invoke a remote command using winrm. 
// The remote VM must have winrm enbled https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-winrm-windows 
 var spawn = require("child_process").spawn,child;
const util = require('util');

function run_powershell(host, username, password, script, callback) 
{    
    var command = util.format('%s', "assets//InvokeRemotePS -host ", host, " -username ", username, " -password ", password, " -scriptpath ", script);
    child = spawn("powershell.exe", [command]);

     var output;   
    child.stdout.on("data",function(output){
        console.log("Powershell Data: " + output);
    });
    child.stderr.on("data",function(data){
        console.log("Powershell Errors: " + data);
        callback(new Error(data));
    });
    child.on("exit",function(){ 
        console.log("Powershell Script finished");        
    });
    child.stdin.end(); //end input          
}

// test
run_powershell("52.178.176.53", "azure", "Admin!234567", "src//dummy.ps1", function(output) {
    console.log(output);
});

