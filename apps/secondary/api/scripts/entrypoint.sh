#!/bin/sh
set -e

echo "Running secondary database migrations..."
pnpm typeorm migration:run -d ./node_modules/@arabiaaislamia/database/dist/data-source.secondary.js

echo "Starting secondary-api..."
exec node dist/main.js
