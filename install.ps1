$ErrorActionPreference = "Stop"

Write-Host "=== Instalador MCP Power BI Personal ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
try {
    $nodeVersion = node -v
    Write-Host "Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "No se encontro Node.js. Instalalo desde https://nodejs.org (version 18 o superior) y volve a correr este script." -ForegroundColor Red
    exit 1
}

# 2. Verificar Claude Code CLI
try {
    claude --version | Out-Null
} catch {
    Write-Host "No se encontro el comando 'claude'. Instala Claude Code antes de continuar." -ForegroundColor Red
    exit 1
}

$scriptDir = $PSScriptRoot
Set-Location $scriptDir

# 3. Instalar dependencias
Write-Host ""
Write-Host "Instalando dependencias (npm install)..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "Fallo npm install." -ForegroundColor Red; exit 1 }

# 4. Login con la cuenta de Power BI del usuario
Write-Host ""
Write-Host "Ahora vas a loguearte con TU cuenta de Power BI (Azure AD)." -ForegroundColor Cyan
Write-Host "Se te va a mostrar un codigo y una URL: abrila en el navegador, pega el codigo," -ForegroundColor Cyan
Write-Host "y confirma con tu cuenta @ocasapbi.onmicrosoft.com (o la que uses para Power BI)." -ForegroundColor Cyan
Write-Host ""
npm run login
if ($LASTEXITCODE -ne 0) { Write-Host "Fallo el login. Volve a correr el script." -ForegroundColor Red; exit 1 }

# 5. Registrar el MCP en Claude Code (scope user = disponible en todos tus proyectos)
Write-Host ""
Write-Host "Registrando el MCP en Claude Code..." -ForegroundColor Cyan
$indexPath = Join-Path $scriptDir "src\index.js"
claude mcp remove powerbi-personal -s user 2>$null | Out-Null
claude mcp add -s user powerbi-personal -- node "$indexPath"
if ($LASTEXITCODE -ne 0) { Write-Host "Fallo el registro del MCP en Claude Code." -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Listo! Reinicia Claude Code (o abri una sesion nueva) para que aparezcan las tools de powerbi-personal." -ForegroundColor Green
