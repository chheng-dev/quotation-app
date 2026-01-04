#!/bin/sh
set -e

echo "🔍 Checking code style and imports..."

# --check returns an error code if files are not formatted/organized
if ! npx prettier --check "."; then
  echo "❌ Error: Code is not formatted or imports are messy."
  echo "Run 'sh scripts/format.sh' locally, commit the changes, then push again."
  exit 1
fi

echo "✅ Check passed!"