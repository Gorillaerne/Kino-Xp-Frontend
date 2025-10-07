#!/bin/sh

# Ensure the target folder exists
mkdir -p /usr/share/nginx/html/js

# Create runtime config file
echo "window.config = { API_BASE_URL: '${API_URL:-http://localhost:8080}' };" > /usr/share/nginx/html/js/config.js

# Start nginx
exec nginx -g 'daemon off;'