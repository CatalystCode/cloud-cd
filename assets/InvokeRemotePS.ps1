param (    
    [string]$hostname,
    [string]$username,
    [string]$password,
    [string]$scriptpath    
 )

$pass = convertto-securestring $password -asplaintext -force
$Credential = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $pass

$so = New-PsSessionOption –SkipCACheck -SkipCNCheck
$session = New-PSSession -ComputerName $hostname -Credential $Credential -UseSSL -SessionOption $so
Invoke-Command -Session $session -FilePath $scriptpath

