#!/bin/sh
set -e
# Run pending migrations, then start the app. TypeORM skips already-run migrations.
echo "Running secondary database migrations..."
node ./node_modules/typeorm/cli.js migration:run -d ./node_modules/@arabiaaislamia/database/dist/data-source.secondary.js
echo "Starting secondary-api..."
exec node dist/main.js
