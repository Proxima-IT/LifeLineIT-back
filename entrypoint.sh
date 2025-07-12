#!/bin/sh

# Optional: wait for redis to be available
echo "⏳ Waiting for Redis..."
until redis-cli -h redis ping | grep -q PONG; do
  sleep 1
done

echo "🧹 Flushing Redis..."
redis-cli -h redis FLUSHALL

# Start the Node server
node server.js
