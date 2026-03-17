#!/usr/bin/env bash
set -euo pipefail

LOCAL_REVIEW_BRANCH="feature/review-jules"

# Always operate from the repository root where this script lives.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git no esta instalado o no esta en PATH."
  exit 1
fi

if ! command -v clasp >/dev/null 2>&1; then
  echo "Error: clasp no esta instalado o no esta en PATH."
  echo "Instala con: npm install -g @google/clasp"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: este script debe ejecutarse dentro de un repositorio git."
  exit 1
fi

echo ""
echo "=== Jules Branch Review Helper ==="
echo "Repo: $(basename "$(git rev-parse --show-toplevel)")"
echo "Rama local de revision: ${LOCAL_REVIEW_BRANCH}"
echo ""
read -r -p "Ingresa la rama remota de Jules (ej: mejorar-contraste-cards-tareas-123): " REMOTE_BRANCH_INPUT

REMOTE_BRANCH="${REMOTE_BRANCH_INPUT#remotes/origin/}"
REMOTE_BRANCH="${REMOTE_BRANCH#origin/}"

if [[ -z "$REMOTE_BRANCH" ]]; then
  echo "Error: no ingresaste una rama."
  exit 1
fi

echo ""
echo "[1/3] Actualizando referencias remotas..."
git fetch origin --prune

if ! git show-ref --verify --quiet "refs/remotes/origin/${REMOTE_BRANCH}"; then
  echo "Error: la rama remota origin/${REMOTE_BRANCH} no existe."
  echo "Tip: ejecuta 'git branch -r' para ver ramas disponibles."
  exit 1
fi

echo "[2/3] Cambiando a ${LOCAL_REVIEW_BRANCH} desde origin/${REMOTE_BRANCH}..."
git checkout -B "$LOCAL_REVIEW_BRANCH" "origin/${REMOTE_BRANCH}"

echo "[3/3] Subiendo estado actual a Apps Script con clasp..."
clasp push

echo ""
echo "Listo."
echo "Ahora estas en: $(git branch --show-current)"
echo "Basada en: origin/${REMOTE_BRANCH}"
