<#
.SYNOPSIS
  Screenshots of a cheatsheet with headless Microsoft Edge (Windows only).
.DESCRIPTION
  Writes to <out>: figures-light.png and figures-dark.png (only the <figure> blocks, 860 px wide),
  and phone.png (the whole page in a 380 px iframe; headless Edge does not go below ~500 px).
.EXAMPLE
  powershell -File screenshots.ps1 -Sheet C:\path\index.html -Out C:\tmp\shots
#>
param(
  [Parameter(Mandatory)] [string] $Sheet,
  [string] $Out = (Join-Path ([IO.Path]::GetTempPath()) 'cheatsheet-shots')
)
$ErrorActionPreference = 'Stop'
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { Write-Error 'Microsoft Edge not found. Skip the screenshot step and say so in the report.'; exit 2 }

New-Item -ItemType Directory -Force $Out | Out-Null
$Out = (Resolve-Path $Out).Path
$src = Get-Content -Raw -Encoding utf8 $Sheet
$style = [regex]::Match($src, '<style>[\s\S]*?</style>').Value
$fonts = [regex]::Match($src, '<link rel="stylesheet"[^>]*>').Value
$figs = ([regex]::Matches($src, '<figure>[\s\S]*?</figure>') | ForEach-Object Value) -join "`n"

function Write-Page($name, $body) { Set-Content -Encoding utf8 -Path (Join-Path $Out $name) -Value $body }
foreach ($t in 'light', 'dark') {
  Write-Page "figures-$t.html" ("<!doctype html><html data-theme=`"$t`"><head><meta charset=`"utf-8`">$fonts$style</head><body><div class=`"wrap`" style=`"max-width:820px`">$figs</div></body></html>")
}
Write-Page 'page.html' ("<!doctype html><html><head><meta charset=`"utf-8`"><meta name=`"viewport`" content=`"width=device-width,initial-scale=1`"></head><body style=`"margin:0`">$src</body></html>")
Write-Page 'phone.html' '<!doctype html><html><body style="margin:0;background:#888"><iframe src="page.html" style="width:380px;height:4000px;border:0;display:block"></iframe></body></html>'

function Shot($page, $png, $size) {
  $url = 'file:///' + ((Join-Path $Out $page) -replace '\\', '/')
  $argv = @('--headless=new', '--disable-gpu', '--hide-scrollbars', "--user-data-dir=$Out\edge-profile",
            '--virtual-time-budget=6000', "--window-size=$size", "--screenshot=$(Join-Path $Out $png)", $url)
  Start-Process -FilePath $edge -ArgumentList $argv -Wait -WindowStyle Hidden
}
if ($figs) { Shot 'figures-light.html' 'figures-light.png' '860,1600'; Shot 'figures-dark.html' 'figures-dark.png' '860,1600' }
Shot 'phone.html' 'phone.png' '500,4000'
Get-ChildItem $Out -Filter *.png | ForEach-Object { $_.FullName }
