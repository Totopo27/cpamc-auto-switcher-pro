#!/usr/bin/env bash
# ==============================================================================
# ⚡ AUTO SWITCHER PRO — Universal All-In-One Installer (Entrypoint Canónico)
#
# Suite Convergente: Plugin CPAMC (.so) + SQLite WAL + Extensión Gentle-Shell/Pi
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALLER="${SCRIPT_DIR}/scripts/install-all.sh"

if [ -f "${INSTALLER}" ]; then
  # Manejo intuitivo de argumentos: si el primer parámetro es una URL, convertir a --url
  if [ $# -eq 1 ] && [[ "$1" =~ ^https?:// ]]; then
    exec bash "${INSTALLER}" --url "$1"
  elif [ $# -eq 2 ] && [[ "$1" =~ ^https?:// ]]; then
    exec bash "${INSTALLER}" --url "$1" --key "$2"
  else
    exec bash "${INSTALLER}" "$@"
  fi
else
  echo "❌ Error: No se encontró el instalador principal en ${INSTALLER}"
  exit 1
fi
