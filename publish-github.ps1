param(
  [string]$RepoName = "portfolio-cassio-diniz-ramalho",
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

$gh = "C:\Program Files\GitHub CLI\gh.exe"
$git = "C:\Program Files\Git\cmd\git.exe"

if (-not (Test-Path $gh)) {
  throw "GitHub CLI nao encontrado em $gh"
}

if (-not (Test-Path $git)) {
  throw "Git nao encontrado em $git"
}

& $gh auth status | Out-Null

$owner = (& $gh api user --jq ".login").Trim()

if (-not $owner) {
  throw "Nao foi possivel identificar o usuario autenticado no GitHub."
}

$repoFullName = "$owner/$RepoName"

$remoteExists = $false
try {
  $remoteUrl = (& $git remote get-url origin).Trim()
  if ($remoteUrl) {
    $remoteExists = $true
  }
} catch {
  $remoteExists = $false
}

if (-not $remoteExists) {
  & $gh repo create $repoFullName --$Visibility --source . --remote origin --push `
    --description "Portfolio profissional de Cassio Diniz Ramalho"
} else {
  & $git push -u origin main
}

Write-Host "Repositorio publicado em https://github.com/$repoFullName"
