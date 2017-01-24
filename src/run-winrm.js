// run powerhsell script localy. the script will invoke a remote command using winrm. 
// The remote VM must have winrm enbled https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-winrm-windows 
var spawn = require("child_process").spawn,child;
child = spawn("powershell.exe",["src//testRemote.ps1"]);
child.stdout.on("data",function(data){
    console.log("Powershell Data: " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
    console.log("Powershell Script finished");
});
child.stdin.end(); //end input