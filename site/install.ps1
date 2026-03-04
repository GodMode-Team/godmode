<#
.SYNOPSIS
    GodMode Universal Installer for Windows

.DESCRIPTION
    Installs GodMode (OpenClaw plugin) on Windows.
      1. Detects platform (Windows architecture)
      2. Checks Node.js 22+ (installs via winget or fnm if missing)
      3. Installs OpenClaw CLI globally via npm
      4. Installs GodMode plugin
      5. Activates license key (if provided)
      6. Checks AI authentication
      7. Configures gateway settings
      8. Starts gateway and opens GodMode

.PARAMETER LicenseKey
    Optional GodMode license key to activate during installation.

.EXAMPLE
    .\install.ps1
    .\install.ps1 -LicenseKey GM-YOUR-KEY
    irm https://lifeongodmode.com/install.ps1 | iex

.NOTES
    Compatible with Windows PowerShell 5.1 and PowerShell 7+.
    Safe to re-run at any time.
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$LicenseKey = ""
)

$ErrorActionPreference = 'Stop'

# ── Constants ────────────────────────────────────────────────────────────────

$TotalSteps = 8
$GodModeUrl = "http://127.0.0.1:18789/godmode/onboarding"

# ── Output helpers ───────────────────────────────────────────────────────────

function Write-Step {
    param([int]$Number, [string]$Message)
    Write-Host ""
    Write-Host "[$Number/$TotalSteps]" -ForegroundColor Cyan -NoNewline
    Write-Host " $Message" -ForegroundColor White
}

function Write-Ok {
    param([string]$Message)
    Write-Host "  [OK]  " -ForegroundColor Green -NoNewline
    Write-Host $Message
}

function Write-Warn {
    param([string]$Message)
    Write-Host "  [!!]  " -ForegroundColor Yellow -NoNewline
    Write-Host $Message -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    Write-Host "  [XX]  " -ForegroundColor Red -NoNewline
    Write-Host $Message -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "        $Message" -ForegroundColor DarkGray
}

# ── Utility functions ────────────────────────────────────────────────────────

function Test-CommandExists {
    param([string]$Name)
    $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Get-NodeMajorVersion {
    try {
        $versionString = & node --version 2>$null
        if ($versionString -match '^v?(\d+)') {
            return [int]$Matches[1]
        }
    } catch {}
    return 0
}

function Refresh-PathEnv {
    # Reload PATH from registry so newly installed tools are found
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$userPath;$machinePath"
}

# ── Banner ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "=== GodMode Installer ===" -ForegroundColor Magenta

# ── Step 1: Platform detection ───────────────────────────────────────────────

Write-Step 1 "Detecting platform"

if ($env:OS -ne "Windows_NT" -and -not $IsWindows) {
    # Allow running on non-Windows for testing, but note it
    if ($IsMacOS) {
        Write-Warn "macOS detected - consider using install.sh instead"
        Write-Info "This script is designed for Windows. Continuing anyway..."
    } elseif ($IsLinux) {
        Write-Warn "Linux detected - consider using install.sh instead"
        Write-Info "This script is designed for Windows. Continuing anyway..."
    }
}

$archLabel = switch ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture) {
    "X64"   { "x64" }
    "Arm64" { "arm64" }
    "X86"   { "x86" }
    default { "$_" }
}

$osDescription = if ($PSVersionTable.PSVersion.Major -ge 6) {
    [System.Runtime.InteropServices.RuntimeInformation]::OSDescription
} else {
    "Windows $([Environment]::OSVersion.Version)"
}

Write-Ok "Platform: Windows ($archLabel) - $osDescription"
Write-Info "PowerShell $($PSVersionTable.PSVersion)"

# ── Step 2: Node.js ──────────────────────────────────────────────────────────

Write-Step 2 "Checking Node.js"

$nodeMajor = Get-NodeMajorVersion

if ($nodeMajor -ge 22) {
    $nodeVersion = & node --version 2>$null
    Write-Ok "Node.js $nodeVersion"
} else {
    if ($nodeMajor -gt 0) {
        $nodeVersion = & node --version 2>$null
        Write-Warn "Node.js $nodeVersion found but 22+ is required"
    } else {
        Write-Warn "Node.js not found - 22+ is required"
    }

    $nodeInstalled = $false

    # Try winget first (built into Windows 11, available on Windows 10)
    if (-not $nodeInstalled -and (Test-CommandExists "winget")) {
        Write-Info "Installing Node.js 22 via winget..."
        try {
            & winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent 2>$null
            Refresh-PathEnv
            $nodeMajor = Get-NodeMajorVersion
            if ($nodeMajor -ge 22) {
                $nodeVersion = & node --version 2>$null
                Write-Ok "Node.js $nodeVersion installed via winget"
                $nodeInstalled = $true
            }
        } catch {
            Write-Info "winget install did not succeed, trying fnm..."
        }
    }

    # Try fnm
    if (-not $nodeInstalled -and (Test-CommandExists "fnm")) {
        Write-Info "Installing Node.js 22 via fnm..."
        try {
            & fnm install 22
            & fnm use 22
            # Update env for fnm
            & fnm env --shell powershell | Out-String | Invoke-Expression
            Refresh-PathEnv
            $nodeMajor = Get-NodeMajorVersion
            if ($nodeMajor -ge 22) {
                $nodeVersion = & node --version 2>$null
                Write-Ok "Node.js $nodeVersion installed via fnm"
                $nodeInstalled = $true
            }
        } catch {
            Write-Info "fnm install did not succeed..."
        }
    }

    if (-not $nodeInstalled) {
        Write-Fail "Could not install Node.js automatically"
        Write-Info "Please install Node.js 22+ manually: https://nodejs.org/en/download"
        Write-Info "Or install via winget:  winget install OpenJS.NodeJS.LTS"
        exit 1
    }
}

# Verify npm is available
if (-not (Test-CommandExists "npm")) {
    Refresh-PathEnv
    if (-not (Test-CommandExists "npm")) {
        Write-Fail "npm not found - Node.js was installed but npm is not on PATH"
        Write-Info "Try opening a new terminal, then re-run this script."
        exit 1
    }
}

# ── Step 3: OpenClaw CLI ─────────────────────────────────────────────────────

Write-Step 3 "Installing OpenClaw CLI"

if (Test-CommandExists "openclaw") {
    $ocVersion = try { & openclaw --version 2>$null } catch { "(version unknown)" }
    Write-Ok "OpenClaw CLI already installed - $ocVersion"
} else {
    Write-Info "Installing openclaw globally via npm..."
    try {
        & npm install -g openclaw 2>&1 | Out-Null
        Refresh-PathEnv
    } catch {
        Write-Fail "OpenClaw CLI install failed"
        Write-Info "Try: npm install -g openclaw"
        exit 1
    }

    if (Test-CommandExists "openclaw") {
        Write-Ok "OpenClaw CLI installed"
    } else {
        Refresh-PathEnv
        if (Test-CommandExists "openclaw") {
            Write-Ok "OpenClaw CLI installed"
        } else {
            Write-Fail "OpenClaw CLI not found after install"
            Write-Info "Try: npm install -g openclaw"
            exit 1
        }
    }
}

# ── Step 4: GodMode plugin ──────────────────────────────────────────────────

Write-Step 4 "Installing GodMode plugin"

$pluginInstalled = $false
try {
    $pluginList = & openclaw plugins list 2>$null
    if ($pluginList -match "(?i)godmode") {
        $pluginInstalled = $true
    }
} catch {}

if ($pluginInstalled) {
    Write-Ok "GodMode plugin already installed"
} else {
    Write-Info "Installing @godmode-team/godmode..."
    try {
        & openclaw plugins install @godmode-team/godmode 2>&1 | Out-Null
        Write-Ok "GodMode plugin installed"
    } catch {
        Write-Fail "GodMode plugin install failed"
        Write-Info "Try: openclaw plugins install @godmode-team/godmode"
        exit 1
    }
}

# ── Step 5: License activation ──────────────────────────────────────────────

Write-Step 5 "Activating license"

if ($LicenseKey) {
    try {
        & openclaw godmode activate $LicenseKey 2>&1 | Out-Null
        Write-Ok "License activated: $LicenseKey"
    } catch {
        Write-Warn "License activation failed - you can activate later in the UI"
        Write-Info "openclaw godmode activate YOUR-LICENSE-KEY"
    }
} else {
    Write-Info "No license key provided - skipping activation"
    Write-Info "You can activate later: openclaw godmode activate YOUR-KEY"
    Write-Info "Or pass it as: .\install.ps1 -LicenseKey GM-YOUR-KEY"
    Write-Info "Or enter it during onboarding in the GodMode UI"
}

# ── Step 6: AI Authentication ───────────────────────────────────────────────

Write-Step 6 "Checking AI authentication"

$authOk = $false
try {
    $authStatus = & openclaw auth status 2>$null
    if ($authStatus -match "(?i)(authenticated|connected|active)") {
        $authOk = $true
    }
} catch {}

if ($authOk) {
    Write-Ok "Already authenticated with Claude"
} else {
    Write-Warn "AI authentication not configured"
    Write-Info "GodMode needs Claude authentication to work. Two options:"
    Write-Host ""
    Write-Info "  Claude Pro/Max subscriber:  openclaw setup-token"
    Write-Info "  API key holder:             openclaw auth login"
    Write-Host ""
    Write-Info "Run one of these commands after this installer finishes,"
    Write-Info "or set it up in the GodMode UI."
}

# ── Step 7: Configure gateway ───────────────────────────────────────────────

Write-Step 7 "Configuring gateway"

# Set gateway configuration values
$configItems = @(
    @{ Key = "gateway.mode";              Value = "local";  Label = "gateway.mode = local" },
    @{ Key = "gateway.controlUi.enabled"; Value = "true";   Label = "gateway.controlUi.enabled = true" },
    @{ Key = "plugins.enabled";           Value = "true";   Label = "plugins.enabled = true" }
)

foreach ($item in $configItems) {
    try {
        & openclaw config set $item.Key $item.Value 2>$null | Out-Null
        Write-Ok $item.Label
    } catch {
        Write-Warn "Could not set $($item.Key)"
    }
}

# Generate security token if missing
$stateDir = if ($env:OPENCLAW_STATE_DIR) { $env:OPENCLAW_STATE_DIR } else { Join-Path $HOME ".openclaw" }
$configFile = Join-Path $stateDir "openclaw.json"

if (Test-Path $configFile) {
    $configContent = Get-Content $configFile -Raw -ErrorAction SilentlyContinue
    if ($configContent -match '"token"') {
        Write-Ok "Gateway security token already set"
    } else {
        # Generate a 64-character hex token
        $tokenBytes = New-Object byte[] 32
        $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
        $rng.GetBytes($tokenBytes)
        $token = ($tokenBytes | ForEach-Object { $_.ToString("x2") }) -join ""
        $rng.Dispose()

        # Use node with env vars to safely manipulate JSON (matches sh version pattern)
        try {
            $env:CONFIG_FILE = $configFile
            $env:GATEWAY_TOKEN = $token
            & node -e @"
const fs = require('fs');
const p = process.env.CONFIG_FILE;
let c = {};
try { c = JSON.parse(fs.readFileSync(p, 'utf-8')); } catch {}
if (!c.gateway) c.gateway = {};
if (!c.gateway.auth) c.gateway.auth = {};
c.gateway.auth.mode = 'token';
c.gateway.auth.token = process.env.GATEWAY_TOKEN;
fs.writeFileSync(p, JSON.stringify(c, null, 2) + '\n');
"@ 2>$null
            Write-Ok "Gateway security token generated"
        } catch {
            Write-Warn "Could not set security token"
        } finally {
            Remove-Item Env:\CONFIG_FILE -ErrorAction SilentlyContinue
            Remove-Item Env:\GATEWAY_TOKEN -ErrorAction SilentlyContinue
        }
    }
}

# ── Step 8: Start gateway ───────────────────────────────────────────────────

Write-Step 8 "Starting gateway"

$gatewayRunning = $false
try {
    $gwStatus = & openclaw gateway status 2>$null
    if ($gwStatus -match "(?i)running") {
        $gatewayRunning = $true
    }
} catch {}

if ($gatewayRunning) {
    Write-Info "Gateway already running - restarting with new config..."
    try {
        & openclaw gateway restart 2>$null | Out-Null
        Write-Ok "Gateway restarted"
    } catch {
        Write-Warn "Restart failed - try: openclaw gateway restart"
    }
} else {
    try {
        & openclaw gateway start 2>$null | Out-Null
        Write-Ok "Gateway started"
    } catch {
        Write-Warn "Could not start gateway automatically"
        Write-Info "Start manually: openclaw gateway start"
    }
}

# Wait for gateway to be ready (up to 10 seconds)
$ready = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:18789/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {}
    Start-Sleep -Seconds 1
}

if ($ready) {
    Write-Ok "Gateway is ready"
} else {
    Write-Warn "Gateway may still be starting - opening browser anyway"
}

# ── Done ─────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  GodMode installed successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Opening GodMode..." -ForegroundColor White
Write-Host "    $GodModeUrl" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 1

# Open browser
try {
    Start-Process $GodModeUrl
} catch {
    Write-Info "Open in your browser: $GodModeUrl"
}

Write-Info "Run this script again at any time - it is safe to re-run."
Write-Info "Need help? https://lifeongodmode.com/support"
Write-Host ""
