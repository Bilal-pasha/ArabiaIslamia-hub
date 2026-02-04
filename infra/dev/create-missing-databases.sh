#!/bin/sh
# Create any missing dev databases (run if postgres was initialized before init-databases.sql had all DBs)
# Usage: from infra/dev/ run: ./create-missing-databases.sh
# Or: docker exec arabiaaislamia-postgres-dev psql -U postgres -c "CREATE DATABASE scouts_portal_db_dev;"

set -e
CONTAINER="${POSTGRES_CONTAINER:-arabiaaislamia-postgres-dev}"
USER="${POSTGRES_USER:-postgres}"

for db in huffaz_db_dev secondary_db_dev scouts_portal_db_dev; do
  if ! docker exec "$CONTAINER" psql -U "$USER" -lqt | cut -d \| -f 1 | grep -qw "$db"; then
    echo "Creating database $db..."
    docker exec "$CONTAINER" psql -U "$USER" -c "CREATE DATABASE $db;"
  else
    echo "Database $db already exists."
  fi
done
