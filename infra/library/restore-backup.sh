#!/usr/bin/env bash
# Restore library database from a pg_dump backup.
#
# Usage:
#   ./restore-backup.sh <backup-file>
#   pnpm library:restore -- library_db_backup_library_db_2026-02-22_095905.sql
#   ./restore-backup.sh library_db_backup_library_db_2026-02-22_095905.sql
#   ./restore-backup.sh library_db_backup/library_db_2026-02-22.sql.gz
#
# Environment (optional):
#   PG_CONTAINER    Postgres container name (default: library-postgres-dev)
#   PG_USER         Postgres user (default: postgres)
#   DB_NAME         Database name (default: library_db)
#   COMPOSE_FILE    Docker compose file to stop/start services (optional)
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PG_CONTAINER="${PG_CONTAINER:-library-postgres-dev}"
PG_USER="${PG_USER:-postgres}"
DB_NAME="${DB_NAME:-library_db}"
COMPOSE_FILE="${COMPOSE_FILE:-$SCRIPT_DIR/dev/docker-compose.yml}"

BACKUP_FILE="${1:-}"

usage() {
  echo "Usage: $0 <backup-file>"
  echo ""
  echo "Restore library database from a pg_dump backup (.sql or .sql.gz)."
  echo "Performs a clean restore: drops and recreates the database."
  echo ""
  echo "Examples:"
  echo "  $0 library_db_backup_library_db_2026-02-22_095905.sql"
  echo "  $0 library_db_backup/library_db_2026-02-22.sql.gz"
  echo ""
  echo "Environment: PG_CONTAINER, PG_USER, DB_NAME, COMPOSE_FILE"
  exit 1
}

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Error: backup file path required"
  usage
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Error: backup file not found: $BACKUP_FILE"
  exit 1
fi

# Resolve to absolute path for docker cp
BACKUP_ABSOLUTE="$(cd "$(dirname "$BACKUP_FILE")" && pwd)/$(basename "$BACKUP_FILE")"

echo "=== Library DB Restore ==="
echo "Container: $PG_CONTAINER"
echo "Database:  $DB_NAME"
echo "Backup:    $BACKUP_FILE"
echo ""

# Check container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${PG_CONTAINER}$"; then
  echo "Error: container '$PG_CONTAINER' is not running."
  echo "Start it with: docker compose -f infra/library/dev/docker-compose.yml up -d"
  exit 1
fi

# Stop services that use the DB (if COMPOSE_FILE set)
if [[ -n "$COMPOSE_FILE" ]] && [[ -f "$COMPOSE_FILE" ]]; then
  echo "Stopping library-api and library-app..."
  docker compose -f "$COMPOSE_FILE" stop library-api library-app 2>/dev/null || true
fi

# Terminate other connections and drop/recreate database
echo "Dropping and recreating database..."
docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d postgres << EOF
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF

# Copy backup into container and restore (handles .sql and .sql.gz)
TMP_PATH="/tmp/library_restore_$(date +%s)"
docker cp "$BACKUP_ABSOLUTE" "$PG_CONTAINER:$TMP_PATH"

if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "Restoring (gzipped)..."
  docker exec -i "$PG_CONTAINER" sh -c "gunzip -c $TMP_PATH | psql -U $PG_USER -d $DB_NAME"
else
  echo "Restoring..."
  docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$DB_NAME" -f "$TMP_PATH"
fi

docker exec "$PG_CONTAINER" rm -f "$TMP_PATH"

echo ""
echo "Restore completed successfully."

# Start services again if we stopped them
if [[ -n "$COMPOSE_FILE" ]] && [[ -f "$COMPOSE_FILE" ]]; then
  echo "Starting library-api and library-app..."
  docker compose -f "$COMPOSE_FILE" start library-api library-app
fi
