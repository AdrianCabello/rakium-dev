$ErrorActionPreference = "Continue"

function Show-Tool {
  param(
    [string]$Name,
    [string]$Command,
    [string[]]$ToolArgs = @("--version")
  )

  $found = Get-Command $Command -ErrorAction SilentlyContinue
  if (-not $found) {
    Write-Output "MISSING $Name ($Command)"
    return
  }

  try {
    $version = & $Command @ToolArgs 2>&1 | Select-Object -First 1
    Write-Output "OK ${Name}: $version"
  } catch {
    Write-Output "OK $Name found at $($found.Source), version check failed: $($_.Exception.Message)"
  }
}

Write-Output "Workspace: C:\Users\Adrii\Documents\Web"
$backendPath = "C:\Users\Adrii\Documents\Web\rakium-be"
if (Test-Path $backendPath) {
  Write-Output "OK Shared backend: $backendPath"
} else {
  Write-Output "MISSING Shared backend: $backendPath"
}
Show-Tool "Node" "node"
Show-Tool "npm" "npm"
Show-Tool "Git" "git"
Show-Tool "GitHub CLI" "gh" -ToolArgs @("--version")
Show-Tool "npx" "npx" -ToolArgs @("--version")

if (Get-Command gh -ErrorAction SilentlyContinue) {
  Write-Output ""
  Write-Output "GitHub auth:"
  gh auth status 2>&1
}

if (Test-Path (Join-Path $backendPath "package.json")) {
  Write-Output ""
  Write-Output "rakium-be scripts:"
  try {
    $pkg = Get-Content (Join-Path $backendPath "package.json") -Raw | ConvertFrom-Json
    $pkg.scripts.PSObject.Properties.Name | Sort-Object | ForEach-Object { Write-Output "- $_" }
  } catch {
    Write-Output "Could not read rakium-be package scripts: $($_.Exception.Message)"
  }
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
  Write-Output ""
  Write-Output "Latest Angular packages:"
  Write-Output ("@angular/core " + (npm view @angular/core version 2>$null))
  Write-Output ("@angular/cli  " + (npm view @angular/cli version 2>$null))
}
