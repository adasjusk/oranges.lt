$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}
$CommonURLPart = 'orangbostr.exe'
$DownloadURL1 = 'https://github.com/adasjusk/OrangBooster/releases/download/7.0/' + $CommonURLPart
$ProgramDataPath = Join-Path -Path "C:\ProgramData" -ChildPath 'InterJava-Programs'
if (-not (Test-Path -Path $ProgramDataPath)) {
    New-Item -Path $ProgramDataPath -ItemType Directory -Force | Out-Null
}
$FilePath = Join-Path -Path $ProgramDataPath -ChildPath "orangboost.exe"
try {
    Invoke-WebRequest -Uri $DownloadURL1 -OutFile $FilePath -UseBasicParsing
} catch {
    Write-Host "Failed to download the executable from $DownloadURL1"
    Write-Host "Error: $_"
    exit 1
}
$process = Start-Process -FilePath $FilePath -PassThru
$process.WaitForExit()
if ($process.ExitCode -eq 0) {
    Write-Host "goodbye!"
} else {
    Write-Host "Program exited with code $($process.ExitCode)."
}
