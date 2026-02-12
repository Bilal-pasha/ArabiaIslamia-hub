#!/bin/sh
set -e

echo "Running secondary database migrations..."
# Run migrations using the built JS DataSource
node dist/data-source.secondary.js migration:run

echo "Starting secondary-api..."
exec node dist/main.js
