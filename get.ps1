$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

# Check for Administrator privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    # Relaunch script as Administrator
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Define download URL and path
$CommonURLPart = 'orangbostr.exe'
$DownloadURL1 = 'https://github.com/adasjusk/OrangBooster/releases/download/7.0/' + $CommonURLPart

$ProgramDataPath = Join-Path -Path "C:\ProgramData" -ChildPath 'InterJava-Programs'

# Create directory if it doesn't exist
if (-not (Test-Path -Path $ProgramDataPath)) {
    New-Item -Path $ProgramDataPath -ItemType Directory -Force | Out-Null
}

# Set file path for the downloaded executable (no random)
$FilePath = Join-Path -Path $ProgramDataPath -ChildPath "orangboost.exe"

# Download the executable
try {
    Invoke-WebRequest -Uri $DownloadURL1 -OutFile $FilePath -UseBasicParsing
} catch {
    Write-Host "Failed to download the executable from $DownloadURL1"
    Write-Host "Error: $_"
    exit 1
}

# Run the downloaded executable
$process = Start-Process -FilePath $FilePath -PassThru
$process.WaitForExit()

# Report the result
if ($process.ExitCode -eq 0) {
    Write-Host "Program executed successfully."
} else {
    Write-Host "Program exited with code $($process.ExitCode)."
}
