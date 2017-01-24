$user = "azure" 
$password = convertto-securestring "Admin!234567" -asplaintext -force
$Credential = new-object -typename System.Management.Automation.PSCredential -argumentlist $user, $password 

$so = New-PsSessionOption –SkipCACheck -SkipCNCheck

#Enter-PSSession -ComputerName 52.178.176.53 -Credential $Credential -UseSSL -SessionOption $so

$session = New-PSSession -ComputerName 52.178.176.53 -Credential $Credential -UseSSL -SessionOption $so
Invoke-Command -Session $session -ScriptBlock {hostname}

