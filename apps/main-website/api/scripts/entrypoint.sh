#!/bin/sh
set -e
echo "Running main-website database migrations..."
node ./node_modules/typeorm/cli.js migration:run -d ./node_modules/@arabiaaislamia/database/dist/data-source.main-website.js
echo "Starting main-website-api..."
exec node dist/main.js
