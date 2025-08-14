#!/bin/sh

echo "=== Starting HireLoop Application ==="
echo "Database path: $DATABASE_PATH"

# Ensure data directory exists
mkdir -p /app/data

echo "Running database migrations..."
npm run migrate:latest

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed"
    exit 1
fi

echo "Starting application..."
exec node server.js 