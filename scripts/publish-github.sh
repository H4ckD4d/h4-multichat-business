#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
repo="H4ckD4d/h4-multichat-business"
if ! command -v gh >/dev/null 2>&1; then
  echo 'GitHub CLI não instalado. No Mac: brew install gh' >&2
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo 'Autentique-se primeiro: gh auth login' >&2
  exit 1
fi
login="$(gh api user --jq .login)"
if [[ "$(printf "%s" "$login" | tr "[:upper:]" "[:lower:]")" != "h4ckd4d" ]]; then
  echo "Conta autenticada: $login. Requer H4ckD4d; não será publicado em outra conta." >&2
  exit 1
fi
if gh repo view "$repo" >/dev/null 2>&1; then
  echo "O repositório $repo já existe. Interrompendo para não sobrescrever." >&2
  exit 1
fi
if [[ ! -d .git ]]; then git init -b main; fi
git add .
if ! git diff --cached --quiet; then
  git commit -m 'chore: bootstrap H4 MultiChat Business pre-MVP'
fi
gh repo create "$repo" --public --description 'H4 MultiChat Business - WhatsApp Business multi-number inbox (pre-MVP starter)' --source=. --remote=origin --push
printf '\nRepositório publicado: https://github.com/%s\n' "$repo"
