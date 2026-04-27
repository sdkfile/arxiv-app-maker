#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="${SCRIPT_DIR}/data"
LIMIT="${ARXIV_FETCH_LIMIT:-100}"

mkdir -p "$DATA_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collecting ${LIMIT} papers from arxiv..."

if ! command -v arxiv-cli &>/dev/null; then
  echo "Error: arxiv-cli not found. Install with: cargo install arxiv-cli"
  exit 1
fi

cd "$DATA_DIR"
arxiv-cli -q "cat:cs.AI OR cat:cs.CV OR cat:cs.LG OR cat:cs.CL OR cat:cs.HC" -l "$LIMIT"

if [ -f "$DATA_DIR/metadata.jsonl" ]; then
  COUNT=$(wc -l < "$DATA_DIR/metadata.jsonl" | tr -d ' ')
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collected ${COUNT} papers → ${DATA_DIR}/metadata.jsonl"
else
  echo "Error: metadata.jsonl not created"
  exit 1
fi
