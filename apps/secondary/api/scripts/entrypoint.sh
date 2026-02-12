#!/bin/sh
set -e

echo "Running secondary database migrations..."
# Run migrations using TypeORM CLI and the database package's built DataSource (copied into dist in Dockerfile)
node ./node_modules/typeorm/cli.js migration:run -d ./dist/data-source.secondary.js

echo "Starting secondary-api..."
exec node dist/main.js
