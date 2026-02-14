#!/bin/sh
set -e
echo "Running library database migrations..."
node ./node_modules/typeorm/cli.js migration:run -d ./node_modules/@arabiaaislamia/database/dist/data-source.library.js
echo "Starting library-api..."
exec node dist/main.js
