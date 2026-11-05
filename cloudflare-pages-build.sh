#!/bin/sh
# Cloudflare Pages: publish only the public portfolio's active static assets.
set -eu

OUTPUT_DIR="dist"
FILES="index.html portfolio-next.css portfolio-next.js portfolio-polish.css portfolio-polish.js"

for file in $FILES; do
  if [ ! -f "$file" ]; then
    echo "Required portfolio asset missing: $file" >&2
    exit 1
  fi
done

mkdir -p "$OUTPUT_DIR"
for file in $FILES; do
  cp "$file" "$OUTPUT_DIR/$file"
done

# Cloudflare Pages applies these headers from the published output directory.
cat > "$OUTPUT_DIR/_headers" <<'HEADERS'
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
HEADERS

echo "Cloudflare Pages static output prepared in $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"
