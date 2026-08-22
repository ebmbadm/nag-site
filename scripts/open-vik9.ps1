$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$url = "http://localhost:3009"

function Test-Vik9Server {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

if (-not (Test-Vik9Server)) {
  Start-Process -FilePath "npm.cmd" -ArgumentList "run dev -- --port 3009" -WorkingDirectory $projectRoot -WindowStyle Hidden
  $deadline = (Get-Date).AddSeconds(45)
  while ((Get-Date) -lt $deadline -and -not (Test-Vik9Server)) { Start-Sleep -Milliseconds 500 }
}

if (-not (Test-Vik9Server)) { throw "VIK9 did not start at $url." }
Start-Process $url
