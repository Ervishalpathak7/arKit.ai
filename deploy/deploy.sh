#!/usr/bin/env bash
set -euo pipefail

cd /home/ervishal/arkit

echo "[$(date -Is)] checking for updates"
docker compose pull --quiet
docker compose up -d
docker image prune -f --filter "until=168h"
echo "[$(date -Is)] done"