#!/bin/sh

set -eu

echo "=== Starting Knext Application ==="
echo "Database path: $DATABASE_PATH"

# Ensure data directory exists
mkdir -p /app/data

echo "Running database migrations..."
node migrate.js
echo "Migrations completed successfully"

echo "Starting application..."
exec node server.js
