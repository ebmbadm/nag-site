#!/usr/bin/env bash
set -euo pipefail

# Deploy / update the NAG site Docker container on PoliteShark.
# Run from /opt/nag-site on the server (or wherever the repo is checked out).

cd "$(dirname "$0")/.."

echo "==> Building image..."
docker build -t nag-site:latest .

echo "==> Stopping old container..."
docker rm -f nag-site >/dev/null 2>&1 || true

echo "==> Starting new container..."
# --env-file and --add-host are required for Supabase/Telegram to work from
# the server (FakeDNS / Xray bypass). Keep them in sync with docs/deploy-timeweb.md.
docker run -d --name nag-site --restart unless-stopped \
  -p 127.0.0.1:8090:3000 \
  --env-file .env \
  --add-host fcqhwpfoiojhuedbezum.supabase.co:104.18.38.10 \
  --add-host fcqhwpfoiojhuedbezum.supabase.co:172.64.149.246 \
  --add-host api.telegram.org:149.154.167.220 \
  nag-site:latest

echo "==> Connecting to supabase_default network..."
docker network connect supabase_default nag-site >/dev/null 2>&1 || true

echo "==> Done."
